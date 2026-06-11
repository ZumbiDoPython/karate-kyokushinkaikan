/**
 * Erro lançado quando outra pessoa salvou a página antes do envio atual.
 */
export class ContentConflictError extends Error {
  /**
   * @param {import('./contentNormalizer').ContentPage|null} serverPage
   */
  constructor(serverPage) {
    super(
      'Esta página foi alterada por outra pessoa desde que você abriu o editor. Recarregue a versão do servidor ou salve por cima com cuidado.'
    );
    this.name = 'ContentConflictError';
    this.serverPage = serverPage;
  }
}

/**
 * @param {unknown} error
 */
export function isContentConflictError(error) {
  return error instanceof ContentConflictError;
}
