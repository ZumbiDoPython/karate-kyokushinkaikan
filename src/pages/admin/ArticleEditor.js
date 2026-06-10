import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BlockListEditor } from '../../components/admin/BlockEditor';
import ImageUrlUploadField from '../../components/admin/ImageUrlUploadField';
import ContentConflictDialog from '../../components/admin/ContentConflictDialog';
import {
  getArticleBySlug,
  saveArticle,
  listAuthors,
  listTags,
  isContentConflictError,
} from '../../services/newsApi';
import {
  createEmptyArticle,
  normalizeArticle,
  collectArticleImages,
  toDatetimeLocalValue,
  fromDatetimeLocalValue,
  formatArticleDate,
} from '../../services/newsNormalizer';
import { slugify } from '../../services/contentNormalizer';
import { assignBlockPositions, withEditorMetadata, formatEditedAt } from '../../utils/contentAdminHelpers';
import { PAGE_STATUS } from '../../services/contentAdminConstants';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const ArticleEditor = () => {
  const { slug: slugParam } = useParams();
  const isNew = slugParam === 'nova';
  const navigate = useNavigate();
  const { userId, userEmail, useFirebaseAuth } = useAdminAuth();

  const [article, setArticle] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');

      try {
        const [a, t] = await Promise.all([
          listAuthors().catch(() => []),
          listTags().catch(() => []),
        ]);
        if (cancelled) return;
        setAuthors(a);
        setTags(t);

        if (isNew) {
          setArticle(createEmptyArticle('news'));
          return;
        }

        const data = await getArticleBySlug(slugParam);
        if (cancelled) return;

        if (!data) {
          setError('Matéria não encontrada.');
          setArticle(createEmptyArticle('news'));
        } else {
          setArticle(normalizeArticle(data));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar');
          setArticle(createEmptyArticle('news'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isNew, slugParam]);

  const contentImages = useMemo(
    () => collectArticleImages(article?.blocks || []),
    [article?.blocks]
  );

  const toggleTag = (tagId) => {
    setArticle((prev) => {
      const ids = prev.tagIds || [];
      const next = ids.includes(tagId) ? ids.filter((id) => id !== tagId) : [...ids, tagId];
      return { ...prev, tagIds: next };
    });
  };

  const performSave = async (status, { forceOverwrite = false } = {}) => {
    if (!article?.title?.trim()) {
      setError('Informe o título.');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');
    setConflict(null);

    const slug = slugify(article.title) || article.slug?.trim() || 'materia';
    const publishedAt = article.publishedAt || new Date().toISOString();

    const payload = withEditorMetadata(
      normalizeArticle({
        ...article,
        slug,
        status,
        publishedAt,
        blocks: assignBlockPositions(article.blocks || []),
      }),
      { userId, userEmail, useFirebaseAuth }
    );

    const saveOptions = {
      expectedRevision:
        typeof article.contentRevision === 'number' ? article.contentRevision : 0,
      forceOverwrite,
    };

    try {
      const saved = await saveArticle(payload, isNew ? {} : saveOptions);
      setArticle(normalizeArticle({ ...saved, status }));
      if (isNew && saved.slug) {
        navigate(`/admin/materias/${saved.slug}`, { replace: true });
      }
      setMessage(status === PAGE_STATUS.PUBLISHED ? 'Matéria publicada.' : 'Rascunho salvo.');
    } catch (err) {
      if (isContentConflictError(err)) {
        setConflict({ serverPage: err.serverPage, action: status });
        return;
      }
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleReloadServer = () => {
    if (!conflict?.serverPage) return;
    setArticle(normalizeArticle(conflict.serverPage));
    setConflict(null);
    setMessage('Versão do servidor carregada.');
  };

  if (loading || !article) {
    return (
      <div className="space-y-2">
        <p className="text-gray-600">Carregando editor...</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  const articleSlug = slugify(article.title) || article.slug || 'rascunho';

  return (
    <div className="space-y-6">
      {conflict && (
        <ContentConflictDialog
          serverPage={conflict.serverPage}
          saving={saving}
          onReloadServer={handleReloadServer}
          onForceSave={() => performSave(conflict.action, { forceOverwrite: true })}
          onCancel={() => setConflict(null)}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin/materias" className="text-sm text-blue-600 hover:underline">
            ← Matérias
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {isNew ? 'Nova matéria' : `Editar: ${article.title}`}
          </h1>
          {article.lastEditedByEmail && (
            <p className="text-sm text-gray-500 mt-1">
              Última edição: {article.lastEditedByEmail}
              {article.lastEditedAt && <> em {formatEditedAt(article.lastEditedAt)}</>}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => performSave(PAGE_STATUS.DRAFT)}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            onClick={() => performSave(PAGE_STATUS.PUBLISHED)}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Publicar
          </button>
        </div>
      </div>

      {message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">{message}</p>
      )}
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</p>
      )}

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Tipo e identificação</h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="articleType"
              checked={article.type === 'news'}
              onChange={() => setArticle({ ...article, type: 'news' })}
            />
            Notícia
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="articleType"
              checked={article.type === 'event'}
              onChange={() => setArticle({ ...article, type: 'event' })}
            />
            Evento
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => {
                const title = e.target.value;
                setArticle((prev) => ({
                  ...prev,
                  title,
                  slug: isNew ? slugify(title) : prev.slug,
                }));
              }}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
              {isNew && (
                <span className="font-normal text-gray-500 ml-1">— gerado do título</span>
              )}
            </label>
            <input
              type="text"
              value={isNew ? slugify(article.title) : article.slug}
              onChange={(e) => {
                if (!isNew) return;
                setArticle({ ...article, slug: slugify(e.target.value) });
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 font-mono bg-gray-50"
              readOnly={isNew}
              disabled={!isNew && !!article.id}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resumo (lista)</label>
            <textarea
              value={article.excerpt}
              onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de publicação</label>
            <input
              type="datetime-local"
              value={toDatetimeLocalValue(article.publishedAt)}
              onChange={(e) =>
                setArticle({
                  ...article,
                  publishedAt: e.target.value
                    ? fromDatetimeLocalValue(e.target.value)
                    : new Date().toISOString(),
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use datas passadas para conteúdo antigo. Vazio = data atual ao publicar (
              {formatArticleDate(new Date().toISOString())}).
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Escrito por</label>
            <select
              value={article.authorId || ''}
              onChange={(e) => setArticle({ ...article, authorId: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="">— Selecionar autor —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <Link to="/admin/autores" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
              Cadastrar autores
            </Link>
          </div>
        </div>

        {article.type === 'event' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data do evento</label>
              <input
                type="date"
                value={article.eventDate || ''}
                onChange={(e) => setArticle({ ...article, eventDate: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
              <input
                type="text"
                value={article.eventLocation || ''}
                onChange={(e) => setArticle({ ...article, eventLocation: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Capa</h2>
        <ImageUrlUploadField
          label="Imagem de capa"
          value={article.coverImage || ''}
          onChange={(coverImage) => setArticle({ ...article, coverImage })}
          uploadFolder={`news/${articleSlug}/cover`}
        />
        {contentImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ou escolher imagem do conteúdo
            </label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) setArticle({ ...article, coverImage: e.target.value });
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="">Selecionar...</option>
              {contentImages.map((img) => (
                <option key={img.src} value={img.src}>
                  {img.alt || img.src.slice(-40)}
                </option>
              ))}
            </select>
          </div>
        )}
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt="Capa"
            className="max-h-40 rounded border object-cover"
          />
        )}
      </section>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma tag.{' '}
            <Link to="/admin/tags" className="text-blue-600 hover:underline">
              Cadastrar tags
            </Link>
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm cursor-pointer ${
                  (article.tagIds || []).includes(tag.id)
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-900'
                    : 'bg-white border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={(article.tagIds || []).includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo</h2>
        <p className="text-xs text-gray-500 mb-3">
          Texto, subtítulo (notícias) e imagens. Imagens marcadas para galeria e seguidas no editor viram mosaico no site.
          Fotos isoladas podem ser ampliadas e navegadas entre todas da matéria.
        </p>
        <BlockListEditor
          blocks={article.blocks || []}
          onChange={(blocks) => setArticle((prev) => ({ ...prev, blocks }))}
          uploadFolder={`news/${articleSlug}`}
          allowSubtitleBlock={article.type === 'news'}
        />
      </section>
    </div>
  );
};

export default ArticleEditor;
