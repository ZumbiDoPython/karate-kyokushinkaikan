import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ContentValidationNotice from '../../components/ContentValidationNotice';
import { validateForAdmin, isExcludedInstitutionalSlug } from '../../utils/contentSchema';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SectionTreeEditor from '../../components/admin/SectionTreeEditor';
import {
  getPageBySlug,
  createPageDraft,
  savePageDraft,
  publishPage,
} from '../../services/contentApi';
import { createEmptyPage, normalizePage } from '../../services/contentNormalizer';
import { serializePageForApi, assignSectionPositions } from '../../utils/contentAdminHelpers';
import { PAGE_STATUS } from '../../services/contentAdminConstants';
import { slugify } from '../../services/contentNormalizer';

const DRAFT_STORAGE_PREFIX = 'kk_content_draft_';

const ContentEditor = () => {
  const { slug: slugParam } = useParams();
  const isNew = slugParam === 'nova';
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadPage = useCallback(async () => {
    if (isNew) {
      setPage(createEmptyPage('nova-pagina'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const draftKey = `${DRAFT_STORAGE_PREFIX}${slugParam}`;
      const localDraft = localStorage.getItem(draftKey);

      let data = await getPageBySlug(slugParam);

      if (localDraft) {
        try {
          const parsed = JSON.parse(localDraft);
          if (window.confirm('Existe um rascunho local. Deseja restaurá-lo?')) {
            data = normalizePage({ ...data, ...parsed });
          }
        } catch {
          /* ignore */
        }
      }

      setPage(normalizePage({ ...data, status: data.status || PAGE_STATUS.DRAFT }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
      setPage(normalizePage(createEmptyPage(slugParam)));
    } finally {
      setLoading(false);
    }
  }, [isNew, slugParam]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const persistLocalDraft = (data) => {
    const key = `${DRAFT_STORAGE_PREFIX}${data.slug}`;
    localStorage.setItem(key, JSON.stringify(serializePageForApi(data)));
  };

  const handlePageField = (field, value) => {
    setPage((p) => {
      const next = { ...p, [field]: value };
      if (field === 'slug' && isExcludedInstitutionalSlug(value)) {
        return p;
      }
      if (field === 'title' && isNew && !p.slug?.replace('nova-pagina', '')) {
        next.slug = slugify(value) || 'nova-pagina';
      }
      return next;
    });
  };

  const validation = useMemo(() => {
    if (!page) return null;
    return validateForAdmin(serializePageForApi(page));
  }, [page]);

  const runValidation = () => {
    if (!page) return null;
    return validateForAdmin(serializePageForApi(page));
  };

  const handleSaveDraft = async () => {
    if (!page) return;

    const check = runValidation();
    if (check && !check.valid) {
      setError('Não foi possível salvar. Corrija os erros indicados abaixo.');
      setMessage('');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    const payload = serializePageForApi({ ...page, status: PAGE_STATUS.DRAFT });

    try {
      let saved;
      if (page.id && !isNew) {
        saved = await savePageDraft(page.id, payload);
      } else {
        saved = await createPageDraft(payload);
        if (saved?.id) {
          navigate(`/admin/conteudo/${saved.slug}`, { replace: true });
        }
      }
      setPage({ ...saved, status: PAGE_STATUS.DRAFT });
      persistLocalDraft(saved);
      setMessage('Rascunho salvo.');
    } catch (err) {
      persistLocalDraft(page);
      setError(
        `${err instanceof Error ? err.message : 'Erro ao salvar'} — rascunho guardado localmente.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!page) return;

    const check = runValidation();
    if (check && !check.valid) {
      setError('Não foi possível publicar. Corrija os erros indicados abaixo.');
      setMessage('');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    const payload = serializePageForApi({ ...page, status: PAGE_STATUS.PUBLISHED });

    try {
      let saved;
      if (page.id) {
        saved = await publishPage(page.id, payload);
      } else {
        saved = await createPageDraft({ ...payload, status: PAGE_STATUS.PUBLISHED });
        navigate(`/admin/conteudo/${saved.slug}`, { replace: true });
      }
      setPage({ ...saved, status: PAGE_STATUS.PUBLISHED });
      localStorage.removeItem(`${DRAFT_STORAGE_PREFIX}${saved.slug}`);
      setMessage('Página publicada.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !page) {
    return <p className="text-gray-600">Carregando editor...</p>;
  }

  const normalizedPage = {
    ...page,
    sections: assignSectionPositions(page.sections || []),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin/conteudo" className="text-sm text-blue-600 hover:underline">
            ← Voltar à lista
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {isNew ? 'Nova página' : `Editar: ${page.title}`}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar rascunho'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Publicar
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">{message}</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</p>}

      {validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
        <ContentValidationNotice
          errors={validation.errors}
          warnings={validation.warnings}
          variant="admin"
        />
      )}

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Cabeçalho da página</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título (h1)</label>
            <input
              type="text"
              value={page.title || ''}
              onChange={(e) => handlePageField('title', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={page.slug || ''}
              onChange={(e) => handlePageField('slug', slugify(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
              disabled={!isNew && !!page.id}
            />
            {isExcludedInstitutionalSlug(page.slug) && (
              <p className="text-xs text-red-600 mt-1">
                O slug &quot;noticias&quot; não é permitido neste editor.
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
            <input
              type="text"
              value={page.subtitle || ''}
              onChange={(e) => handlePageField('subtitle', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem parallax</label>
            <input
              type="url"
              value={page.parallaxImage || ''}
              onChange={(e) => handlePageField('parallaxImage', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <SectionTreeEditor
          page={normalizedPage}
          onChange={setPage}
          selectedSectionId={selectedSectionId}
          onSelectSection={setSelectedSectionId}
        />
      </section>
    </div>
  );
};

export default ContentEditor;
