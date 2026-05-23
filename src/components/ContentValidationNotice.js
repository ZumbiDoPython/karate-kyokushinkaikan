import React from 'react';

/**
 * @param {Object} props
 * @param {import('../utils/contentSchema').ValidationIssue[]} [props.errors]
 * @param {import('../utils/contentSchema').ValidationIssue[]} [props.warnings]
 * @param {'admin'|'public'} [props.variant]
 */
const ContentValidationNotice = ({ errors = [], warnings = [], variant = 'public' }) => {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  if (!hasErrors && !hasWarnings) return null;

  const boxClass =
    variant === 'admin'
      ? 'rounded-lg border p-4 space-y-2 text-sm'
      : 'rounded border p-3 mb-4 text-sm';

  return (
    <div
      className={`${boxClass} ${
        hasErrors
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}
      role="alert"
    >
      {hasErrors && (
        <div>
          <p className="font-semibold">
            {variant === 'admin'
              ? 'Corrija os itens abaixo antes de salvar ou publicar:'
              : 'Parte do conteúdo não pôde ser exibida:'}
          </p>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            {errors.map((e, i) => (
              <li key={`e-${i}`}>{e.message}</li>
            ))}
          </ul>
        </div>
      )}
      {hasWarnings && (
        <div className={hasErrors ? 'pt-2 border-t border-red-200/50' : ''}>
          <p className="font-semibold">
            {variant === 'admin' ? 'Avisos:' : 'Alguns blocos foram ocultados:'}
          </p>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            {warnings.map((w, i) => (
              <li key={`w-${i}`}>{w.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Aviso inline para um bloco inválido omitido (modo debug leve no admin).
 */
export const SkippedBlockNotice = ({ message }) => (
  <div className="my-2 px-3 py-2 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-500">
    Bloco omitido: {message}
  </div>
);

export default ContentValidationNotice;
