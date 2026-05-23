/**
 * Feature flags do app (variáveis REACT_APP_*).
 */

/** Páginas no piloto de migração para contentApi */
export const CONTENT_API_PILOT_SLUGS = ['kyokushinkaikan'];

/**
 * Flag global: REACT_APP_USE_CONTENT_API=true ativa o modo API
 * para slugs listados em CONTENT_API_PILOT_SLUGS.
 */
export function isContentApiEnabled() {
  return process.env.REACT_APP_USE_CONTENT_API === 'true';
}

/**
 * @param {string} slug
 */
export function isContentApiEnabledForSlug(slug) {
  if (!isContentApiEnabled()) return false;
  return CONTENT_API_PILOT_SLUGS.includes(slug);
}

/**
 * Slugs que possuem componente legado (hardcoded).
 * @param {string} slug
 */
export function hasLegacyPage(slug) {
  return CONTENT_API_PILOT_SLUGS.includes(slug);
}

const featureFlags = {
  CONTENT_API_PILOT_SLUGS,
  isContentApiEnabled,
  isContentApiEnabledForSlug,
  hasLegacyPage,
};

export default featureFlags;
