import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listArticles, deleteArticle } from '../../services/newsApi';
import { formatArticleDate } from '../../services/newsNormalizer';
import { formatEditedAt } from '../../utils/contentAdminHelpers';
import { PAGE_STATUS } from '../../services/contentAdminConstants';

const typeLabel = (type) => (type === 'event' ? 'Evento' : 'Notícia');

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    listArticles()
      .then(setArticles)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao listar'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (slug, title) => {
    if (!window.confirm(`Remover "${title}"?`)) return;
    try {
      await deleteArticle(slug);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  };

  if (loading) return <p className="text-gray-600">Carregando matérias...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notícias e eventos</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/autores"
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
          >
            Autores
          </Link>
          <Link
            to="/admin/tags"
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
          >
            Tags
          </Link>
          <Link
            to="/admin/materias/nova"
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-sm font-medium"
          >
            + Nova matéria
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">{error}</p>
      )}

      {articles.length === 0 ? (
        <p className="text-gray-500 italic">Nenhuma matéria cadastrada.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Publicação</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Última edição</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{article.title}</td>
                  <td className="px-4 py-3">{typeLabel(article.type)}</td>
                  <td className="px-4 py-3">{formatArticleDate(article.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        article.status === PAGE_STATUS.PUBLISHED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {article.status === PAGE_STATUS.PUBLISHED ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {article.lastEditedByEmail && (
                      <>
                        {article.lastEditedByEmail}
                        {article.lastEditedAt && <> · {formatEditedAt(article.lastEditedAt)}</>}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/materias/${article.slug}`}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(article.slug, article.title)}
                      className="text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
