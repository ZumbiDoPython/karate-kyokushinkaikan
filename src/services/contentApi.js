/**
 * Cliente de conteúdo institucional.
 * Backends: Firestore (produção) | localStorage (dev) | HTTP API (opcional).
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
import { getContentStorageMode } from '../config/contentStorage';
import {
  ensureContentSeeded,
  listPagesLocal,
  getPageBySlugLocal,
  upsertPageLocal,
  deletePageLocal,
} from './contentLocalStore';
import {
  listPagesFirestore,
  getPageBySlugFirestore,
  upsertPageFirestore,
  deletePageFirestore,
} from './contentFirestoreStore';

const CONTENT_API_BASE =
  (process.env.REACT_APP_CONTENT_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

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
  const mode = getContentStorageMode();

  if (mode === 'firestore') {
    return listPagesFirestore();
  }

  if (mode === 'local') {
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
 * GET página por slug
 * @param {string} slug
 * @param {{ publicOnly?: boolean }} [options] — site público: só published
 */
export async function getPageBySlug(slug, options = {}) {
  if (!slug) return null;

  const mode = getContentStorageMode();

  if (mode === 'firestore') {
    const page = await getPageBySlugFirestore(slug, options);
    return page || (options.publicOnly ? null : createEmptyPage(slug));
  }

  if (mode === 'local') {
    ensureContentSeeded();
    return getPageBySlugLocal(slug) || createEmptyPage(slug);
  }

  try {
    const response = await fetch(
      `${CONTENT_API_BASE}/content/pages/${encodeURIComponent(slug)}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 404) {
      return getPageBySlugLocal(slug) || createEmptyPage(slug);
    }

    if (!response.ok) {
      throw new Error(`Content API ${response.status}`);
    }

    return mapApiResponseToPage(await response.json());
  } catch (error) {
    console.warn(`[contentApi] getPageBySlug("${slug}") fallback local:`, error);
    ensureContentSeeded();
    return getPageBySlugLocal(slug) || createEmptyPage(slug);
  }
}

/**
 * POST /content/pages
 */
export async function createPage(payload) {
  const mode = getContentStorageMode();
  const page = payloadToPage(payload);

  if (mode === 'firestore') return upsertPageFirestore(page);
  if (mode === 'local') return upsertPageLocal(page);

  try {
    const data = await request('/content/pages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapApiResponseToPage(data);
  } catch (error) {
    console.warn('[contentApi] createPage fallback local:', error);
    return upsertPageLocal(page);
  }
}

/**
 * PUT /content/pages/:id
 */
/**
 * @param {string} id
 * @param {Record<string, unknown>} payload
 * @param {{ expectedRevision?: number, forceOverwrite?: boolean }} [saveOptions]
 */
export async function updatePage(id, payload, saveOptions = {}) {
  const mode = getContentStorageMode();
  const page = payloadToPage({ ...payload, id });

  if (mode === 'firestore') return upsertPageFirestore(page, saveOptions);
  if (mode === 'local') return upsertPageLocal(page, saveOptions);

  try {
    const data = await request(`/content/pages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapApiResponseToPage(data);
  } catch (error) {
    console.warn('[contentApi] updatePage fallback local:', error);
    return upsertPageLocal(page);
  }
}

/**
 * DELETE /content/pages/:id
 */
export async function deletePage(id) {
  const mode = getContentStorageMode();

  if (mode === 'firestore') {
    await deletePageFirestore(id);
    return null;
  }

  if (mode === 'local') {
    deletePageLocal(id);
    return null;
  }

  try {
    return await request(`/content/pages/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (error) {
    deletePageLocal(id);
    return null;
  }
}

export async function savePageDraft(id, payload, saveOptions) {
  return updatePage(id, { ...payload, status: 'draft' }, saveOptions);
}

export async function publishPage(id, payload, saveOptions) {
  return updatePage(id, { ...payload, status: 'published' }, saveOptions);
}

export { ContentConflictError, isContentConflictError } from './contentConflict';

export async function createPageDraft(payload) {
  return createPage({ ...payload, status: 'draft' });
}

// Seções/blocos HTTP (legado — só se usar API remota)
export async function createSection(payload) {
  const data = await request('/content/sections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeSection(data?.section || data);
}

export async function updateSection(id, payload) {
  const data = await request(`/content/sections/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return normalizeSection(data?.section || data);
}

export async function deleteSection(id) {
  return request(`/content/sections/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function createBlock(payload) {
  const data = await request('/content/blocks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeBlock(data?.block || data);
}

export async function updateBlock(id, payload) {
  const data = await request(`/content/blocks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return normalizeBlock(data?.block || data);
}

export async function deleteBlock(id) {
  return request(`/content/blocks/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function reorderBlocks(sectionId, blocks) {
  const ordered = sortByPosition(blocks);
  const data = await request('/content/blocks/reorder', {
    method: 'PUT',
    body: JSON.stringify({ sectionId, blocks: ordered }),
  });
  return (data?.blocks || []).map((b, i) => normalizeBlock(b, i)).filter(Boolean);
}

export const fetchPageBySlug = getPageBySlug;

export async function fetchPageByRoute(route, options) {
  return getPageBySlug(getSlugFromRoute(route), options);
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

export default {
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
};
