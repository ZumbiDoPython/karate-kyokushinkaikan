import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPages } from '../../services/contentApi';
import { resetSeedsToLocalStore } from '../../services/contentLocalStore';
import { seedFirestoreFromSeeds } from '../../services/contentFirestoreStore';
import { PAGE_STATUS } from '../../services/contentAdminConstants';
import { isInstitutionalSlug } from '../../utils/contentSchema';
import { isFirestoreStorage } from '../../config/contentStorage';
import { formatEditedAt } from '../../utils/contentAdminHelpers';

const statusBadge = (status) => {
  const published = status === PAGE_STATUS.PUBLISHED;
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${published ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}
    >
      {published ? 'Publicado' : 'Rascunho'}
    </span>
  );
};

const ContentList = () => {
  const firestoreMode = isFirestoreStorage();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restoring, setRestoring] = useState(false);

  const loadList = () => {
    setLoading(true);
    listPages()
      .then((data) => setPages(data.filter((p) => isInstitutionalSlug(p.slug))))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao listar'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleRestoreSeeds = async () => {
    const message = firestoreMode
      ? 'Publicar o conteúdo original (seeds) no Firestore? Páginas existentes com o mesmo slug serão atualizadas.'
      : 'Restaurar o conteúdo original de Kyokushinkaikan? Alterações locais nessa página serão substituídas.';

    if (!window.confirm(message)) return;

    setRestoring(true);
    setError('');

    try {
      if (firestoreMode) {
        await seedFirestoreFromSeeds();
      } else {
        resetSeedsToLocalStore();
      }
      loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao restaurar conteúdo');
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Carregando páginas...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Páginas institucionais</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRestoreSeeds}
            disabled={restoring}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {restoring ? 'Restaurando...' : 'Restaurar conteúdo original'}
          </button>
          <Link
            to="/admin/conteudo/nova"
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded font-semibold text-gray-900 text-sm"
          >
            Nova página
          </Link>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        {firestoreMode
          ? 'Conteúdo salvo no Cloud Firestore — alterações no admin aparecem para todos os visitantes.'
          : 'Conteúdo no armazenamento local do navegador (desenvolvimento). Use Firestore em produção.'}
      </p>

      {error && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
          {error}
        </p>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seções</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última edição</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.slug} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{page.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{page.slug}</td>
                <td className="px-4 py-3">{statusBadge(page.status)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{page.sections?.length ?? 0}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {page.lastEditedByEmail ? (
                    <>
                      <span className="block">{page.lastEditedByEmail}</span>
                      {page.lastEditedAt && (
                        <span className="text-xs text-gray-400">
                          {formatEditedAt(page.lastEditedAt)}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/conteudo/${page.slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentList;
