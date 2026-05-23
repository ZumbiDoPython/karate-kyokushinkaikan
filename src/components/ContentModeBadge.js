import React from 'react';
import { isContentApiEnabledForSlug } from '../config/featureFlags';

/**
 * Indicador visual (dev) do modo de conteúdo ativo — útil na comparação do piloto.
 */
const ContentModeBadge = ({ slug }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  const apiMode = isContentApiEnabledForSlug(slug);

  return (
    <div
      className={`fixed bottom-3 right-3 z-50 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
        apiMode ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
      }`}
      title="Feature flag REACT_APP_USE_CONTENT_API"
    >
      {slug}: {apiMode ? 'Content API' : 'Legado'}
    </div>
  );
};

export default ContentModeBadge;
