import React from 'react';
import { isContentApiEnabledForSlug } from '../config/featureFlags';
import { getContentStorageMode } from '../config/contentStorage';

/**
 * Indicador visual (dev) do modo de conteúdo ativo.
 */
const ContentModeBadge = ({ slug }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  const apiMode = isContentApiEnabledForSlug(slug);
  const storage = getContentStorageMode();

  return (
    <div
      className={`fixed bottom-3 right-3 z-50 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
        apiMode ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
      }`}
      title="REACT_APP_USE_CONTENT_API / armazenamento"
    >
      {slug}: {apiMode ? `API (${storage})` : 'Legado'}
    </div>
  );
};

export default ContentModeBadge;
