import React from 'react';
import { formatEditedAt } from '../../utils/contentAdminHelpers';

/**
 * @param {Object} props
 * @param {import('../../services/contentNormalizer').ContentPage|null} props.serverPage
 * @param {boolean} props.saving
 * @param {() => void} props.onReloadServer
 * @param {() => void} props.onForceSave
 * @param {() => void} props.onCancel
 */
const ContentConflictDialog = ({
  serverPage,
  saving,
  onReloadServer,
  onForceSave,
  onCancel,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="content-conflict-title"
  >
    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
      <h2 id="content-conflict-title" className="text-lg font-bold text-gray-900">
        Conflito de edição
      </h2>
      <p className="text-sm text-gray-700">
        Outra pessoa salvou esta página enquanto você editava. Se continuar sem recarregar, o
        trabalho dela pode ser perdido — ou o seu, se você recarregar sem copiar suas mudanças.
      </p>
      {serverPage && (
        <div className="text-sm bg-amber-50 border border-amber-200 rounded p-3 text-amber-950">
          <p className="font-medium">Versão no servidor</p>
          {serverPage.lastEditedByEmail && (
            <p>
              Editado por: <span className="font-medium">{serverPage.lastEditedByEmail}</span>
            </p>
          )}
          {serverPage.lastEditedAt && (
            <p>Em: {formatEditedAt(serverPage.lastEditedAt)}</p>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Suas alterações atuais continuam na tela. Um rascunho local também foi guardado ao tentar
        salvar.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Continuar editando
        </button>
        <button
          type="button"
          onClick={onReloadServer}
          disabled={saving || !serverPage}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Usar versão do servidor
        </button>
        <button
          type="button"
          onClick={onForceSave}
          disabled={saving}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar minha versão (substituir)'}
        </button>
      </div>
    </div>
  </div>
);

export default ContentConflictDialog;
