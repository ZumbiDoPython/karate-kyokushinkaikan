/**
 * Armazenamento local (localStorage) — banco de conteúdo quando a API remota não está disponível.
 */
import { CONTENT_SEEDS, CONTENT_SEEDS_BY_SLUG } from '../data/contentSeeds';
import { normalizePage } from './contentNormalizer';
import { INSTITUTIONAL_PAGE_SLUGS } from './contentAdminConstants';

const STORAGE_KEY = 'kk_content_store_v1';

export const CONTENT_STORE_UPDATED_EVENT = 'kk-content-store-updated';

function notifyStoreUpdated() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CONTENT_STORE_UPDATED_EVENT));
}

/**
 * @returns {{ pages: Record<string, import('./contentNormalizer').ContentPage> }}
 */
function readStore() {
  if (typeof window === 'undefined') {
    return { pages: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { pages: {} };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && parsed.pages ? parsed : { pages: {} };
  } catch {
    return { pages: {} };
  }
}

/**
 * @param {{ pages: Record<string, import('./contentNormalizer').ContentPage> }} store
 */
function writeStore(store) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  notifyStoreUpdated();
}

/**
 * Garante seeds publicados no armazenamento local (só preenche slugs ausentes).
 */
export function ensureContentSeeded() {
  const store = readStore();
  let changed = false;

  CONTENT_SEEDS.forEach((seed) => {
    if (!store.pages[seed.slug]) {
      store.pages[seed.slug] = normalizePage({
        ...seed,
        id: seed.id || `local-${seed.slug}`,
        status: seed.status || 'published',
      });
      changed = true;
    }
  });

  if (changed) writeStore(store);
  return changed;
}

/**
 * @returns {import('./contentNormalizer').ContentPage[]}
 */
export function listPagesLocal() {
  ensureContentSeeded();
  const store = readStore();
  const pages = Object.values(store.pages);

  if (pages.length > 0) return pages;

  return INSTITUTIONAL_PAGE_SLUGS.map((slug) => {
    const seed = CONTENT_SEEDS_BY_SLUG[slug];
    if (seed) {
      return normalizePage({
        ...seed,
        id: seed.id || `local-${slug}`,
        status: 'published',
      });
    }
    return normalizePage({ slug, title: slug, sections: [] });
  });
}

/**
 * @param {string} slug
 * @returns {import('./contentNormalizer').ContentPage|null}
 */
export function getPageBySlugLocal(slug) {
  ensureContentSeeded();
  const store = readStore();

  if (store.pages[slug]) {
    return normalizePage(store.pages[slug]);
  }

  const seed = CONTENT_SEEDS_BY_SLUG[slug];
  if (seed) {
    const page = normalizePage({
      ...seed,
      id: seed.id || `local-${slug}`,
      status: seed.status || 'published',
    });
    store.pages[slug] = page;
    writeStore(store);
    return page;
  }

  return null;
}

/**
 * @param {import('./contentNormalizer').ContentPage} page
 */
export function upsertPageLocal(page) {
  ensureContentSeeded();
  const store = readStore();
  const slug = page.slug;
  const existing = store.pages[slug];
  const id = page.id || existing?.id || `local-${slug}-${Date.now()}`;

  const saved = normalizePage({ ...page, id, slug });
  store.pages[slug] = saved;
  writeStore(store);
  return saved;
}

/**
 * @param {string} idOrSlug
 */
export function deletePageLocal(idOrSlug) {
  const store = readStore();
  const entry = Object.entries(store.pages).find(
    ([slug, p]) => slug === idOrSlug || p.id === idOrSlug
  );
  if (!entry) return false;
  delete store.pages[entry[0]];
  writeStore(store);
  return true;
}

/**
 * Restaura páginas seed (sobrescreve slugs conhecidos nos seeds).
 */
export function resetSeedsToLocalStore() {
  const store = readStore();
  CONTENT_SEEDS.forEach((seed) => {
    store.pages[seed.slug] = normalizePage({
      ...seed,
      id: seed.id || `local-${seed.slug}`,
      status: seed.status || 'published',
    });
  });
  writeStore(store);
  return Object.values(store.pages).filter((p) =>
    CONTENT_SEEDS.some((s) => s.slug === p.slug)
  );
}

export function isLocalContentStoreEnabled() {
  return process.env.REACT_APP_CONTENT_USE_LOCAL_STORE !== 'false';
}
