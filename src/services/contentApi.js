/**
 * Cliente HTTP para a API de conteúdo institucional.
 * Fonte única de conteúdo do site (páginas institucionais e notícias).
 *
 * Endpoints:
 *   GET    /content/pages
 *   GET    /content/pages/:slug
 *   POST   /content/pages
 *   PUT    /content/pages/:id
 *   DELETE /content/pages/:id
 *   POST   /content/sections
 *   PUT    /content/sections/:id
 *   DELETE /content/sections/:id
 *   POST   /content/blocks
 *   PUT    /content/blocks/:id
 *   DELETE /content/blocks/:id
 */

import {
  mapApiResponseToPage,
  createEmptyPage,
  getSlugFromRoute,
  ROUTE_SLUG_MAP,
  slugify,
  extractYoutubeId,
  normalizePage,
  normalizeBlock,
  normalizeSection,
  sortByPosition,
} from './contentNormalizer';
import {
  ensureContentSeeded,
  listPagesLocal,
  getPageBySlugLocal,
  upsertPageLocal,
  deletePageLocal,
  isLocalContentStoreEnabled,
} from './contentLocalStore';

const CONTENT_API_BASE =
  (process.env.REACT_APP_CONTENT_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

function preferLocalStore() {
  return isLocalContentStoreEnabled();
}

/**
 * @param {Record<string, unknown>} payload
 */
function payloadToPage(payload) {
  return normalizePage({
    ...payload,
    slug: String(payload.slug || ''),
    title: String(payload.title || payload.slug || ''),
    sections: payload.sections,
  });
}

/**
 * @param {string} path
 * @param {RequestInit} [options]
 */
async function request(path, options = {}) {
  const url = `${CONTENT_API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Content API ${response.status}: ${body || response.statusText}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

// ---------------------------------------------------------------------------
// Páginas
// ---------------------------------------------------------------------------

/**
 * GET /content/pages
 * @returns {Promise<import('./contentNormalizer').ContentPage[]>}
 */
export async function listPages() {
  if (preferLocalStore()) {
    ensureContentSeeded();
    return listPagesLocal();
  }

  try {
    const data = await request('/content/pages');
    const pages = Array.isArray(data) ? data : data?.pages || [];
    return pages.map((p) => mapApiResponseToPage({ page: p }));
  } catch (error) {
    console.warn('[contentApi] listPages fallback local:', error);
    ensureContentSeeded();
    return listPagesLocal();
  }
}

/**
 * GET /content/pages/:slug
 * @param {string} slug
 * @returns {Promise<import('./contentNormalizer').ContentPage|null>}
 */
export async function getPageBySlug(slug) {
  if (!slug) return null;

  if (preferLocalStore()) {
    ensureContentSeeded();
    return getPageBySlugLocal(slug) || createEmptyPage(slug);
  }

  const url = `${CONTENT_API_BASE}/content/pages/${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 404) {
      const local = getPageBySlugLocal(slug);
      return local || createEmptyPage(slug);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Content API ${response.status}: ${body || response.statusText}`);
    }

    const data = await response.json();
    return mapApiResponseToPage(data);
  } catch (error) {
    console.warn(`[contentApi] getPageBySlug("${slug}") fallback local:`, error);
    ensureContentSeeded();
    const local = getPageBySlugLocal(slug);
    if (local) return local;
    throw error;
  }
}

/**
 * POST /content/pages
 * @param {Record<string, unknown>} payload
 */
export async function createPage(payload) {
  if (preferLocalStore()) {
    return upsertPageLocal(payloadToPage(payload));
  }

  try {
    const data = await request('/content/pages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapApiResponseToPage(data);
  } catch (error) {
    console.warn('[contentApi] createPage fallback local:', error);
    return upsertPageLocal(payloadToPage(payload));
  }
}

/**
 * PUT /content/pages/:id
 * @param {string} id
 * @param {Record<string, unknown>} payload
 */
export async function updatePage(id, payload) {
  if (preferLocalStore()) {
    return upsertPageLocal(payloadToPage({ ...payload, id }));
  }

  try {
    const data = await request(`/content/pages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapApiResponseToPage(data);
  } catch (error) {
    console.warn('[contentApi] updatePage fallback local:', error);
    return upsertPageLocal(payloadToPage({ ...payload, id }));
  }
}

/**
 * DELETE /content/pages/:id
 * @param {string} id
 */
export async function deletePage(id) {
  if (preferLocalStore()) {
    deletePageLocal(id);
    return null;
  }

  try {
    return await request(`/content/pages/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (error) {
    console.warn('[contentApi] deletePage fallback local:', error);
    deletePageLocal(id);
    return null;
  }
}

/**
 * Salvar rascunho (status: draft).
 * @param {string} id
 * @param {Record<string, unknown>} payload
 */
export async function savePageDraft(id, payload) {
  return updatePage(id, { ...payload, status: 'draft' });
}

/**
 * Publicar página (status: published).
 * @param {string} id
 * @param {Record<string, unknown>} payload
 */
export async function publishPage(id, payload) {
  return updatePage(id, { ...payload, status: 'published' });
}

/**
 * Criar página em rascunho.
 * @param {Record<string, unknown>} payload
 */
export async function createPageDraft(payload) {
  return createPage({ ...payload, status: 'draft' });
}

// ---------------------------------------------------------------------------
// Seções
// ---------------------------------------------------------------------------

/**
 * POST /content/sections
 * @param {Record<string, unknown>} payload
 */
export async function createSection(payload) {
  const data = await request('/content/sections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeSection(data?.section || data);
}

/**
 * PUT /content/sections/:id
 * @param {string} id
 * @param {Record<string, unknown>} payload
 */
export async function updateSection(id, payload) {
  const data = await request(`/content/sections/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return normalizeSection(data?.section || data);
}

/**
 * DELETE /content/sections/:id
 * @param {string} id
 */
export async function deleteSection(id) {
  return request(`/content/sections/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Blocos (text | image | youtube) com ordenação por position
// ---------------------------------------------------------------------------

/**
 * POST /content/blocks
 * @param {Record<string, unknown>} payload
 */
export async function createBlock(payload) {
  const data = await request('/content/blocks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const block = data?.block || data;
  return normalizeBlock(block);
}

/**
 * PUT /content/blocks/:id
 * @param {string} id
 * @param {Record<string, unknown>} payload
 */
export async function updateBlock(id, payload) {
  const data = await request(`/content/blocks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  const block = data?.block || data;
  return normalizeBlock(block);
}

/**
 * DELETE /content/blocks/:id
 * @param {string} id
 */
export async function deleteBlock(id) {
  return request(`/content/blocks/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/**
 * PUT /content/blocks/reorder — persiste ordenação por position
 * @param {string} sectionId
 * @param {{ id: string, position: number }[]} blocks
 */
export async function reorderBlocks(sectionId, blocks) {
  const ordered = sortByPosition(blocks);
  const data = await request('/content/blocks/reorder', {
    method: 'PUT',
    body: JSON.stringify({ sectionId, blocks: ordered }),
  });
  return (data?.blocks || []).map((b, i) => normalizeBlock(b, i)).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Leitura para o front (hooks / páginas institucionais)
// ---------------------------------------------------------------------------

/** @deprecated Use getPageBySlug */
export const fetchPageBySlug = getPageBySlug;

/**
 * @param {string} route
 */
export async function fetchPageByRoute(route) {
  const slug = getSlugFromRoute(route);
  return getPageBySlug(slug);
}

export {
  mapApiResponseToPage,
  normalizePage,
  normalizeSection,
  normalizeBlock,
  createEmptyPage,
  getSlugFromRoute,
  ROUTE_SLUG_MAP,
  slugify,
  extractYoutubeId,
  sortByPosition,
};

const contentApi = {
  listPages,
  getPageBySlug,
  fetchPageBySlug,
  fetchPageByRoute,
  createPage,
  createPageDraft,
  updatePage,
  savePageDraft,
  publishPage,
  deletePage,
  createSection,
  updateSection,
  deleteSection,
  createBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  mapApiResponseToPage,
  normalizePage,
  ROUTE_SLUG_MAP,
  getSlugFromRoute,
  slugify,
  extractYoutubeId,
};

export default contentApi;
