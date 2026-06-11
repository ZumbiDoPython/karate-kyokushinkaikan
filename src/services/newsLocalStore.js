import {
  normalizeArticle,
  normalizeAuthor,
  normalizeTag,
} from './newsNormalizer';

const STORAGE_KEY = 'kk_news_store_v1';

function readStore() {
  if (typeof window === 'undefined') {
    return { articles: {}, authors: {}, tags: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { articles: {}, authors: {}, tags: {} };
    const parsed = JSON.parse(raw);
    return {
      articles: parsed.articles || {},
      authors: parsed.authors || {},
      tags: parsed.tags || {},
    };
  } catch {
    return { articles: {}, authors: {}, tags: {} };
  }
}

function writeStore(store) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function listArticlesLocal(options = {}) {
  const { publicOnly = false, type, tagId } = options;
  const store = readStore();
  let items = Object.values(store.articles).map(normalizeArticle);

  if (publicOnly) items = items.filter((a) => a.status === 'published');
  if (type) items = items.filter((a) => a.type === type);
  if (tagId) items = items.filter((a) => (a.tagIds || []).includes(tagId));

  return items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlugLocal(slug, options = {}) {
  const { publicOnly = false } = options;
  const store = readStore();
  const raw = store.articles[slug];
  if (!raw) return null;
  const article = normalizeArticle(raw);
  if (publicOnly && article.status !== 'published') return null;
  return article;
}

export function upsertArticleLocal(article) {
  const store = readStore();
  const normalized = normalizeArticle(article);
  const slug = normalized.slug;
  const existing = store.articles[slug];
  const rev = existing?.contentRevision ? existing.contentRevision + 1 : 1;
  const saved = normalizeArticle({ ...normalized, id: normalized.id || slug, contentRevision: rev });
  store.articles[slug] = saved;
  writeStore(store);
  return saved;
}

export function deleteArticleLocal(slug) {
  const store = readStore();
  if (!store.articles[slug]) return false;
  delete store.articles[slug];
  writeStore(store);
  return true;
}

export function listAuthorsLocal() {
  const store = readStore();
  return Object.values(store.authors)
    .map(normalizeAuthor)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.name.localeCompare(b.name));
}

export function upsertAuthorLocal(author) {
  const store = readStore();
  const normalized = normalizeAuthor(author);
  store.authors[normalized.id] = normalized;
  writeStore(store);
  return normalized;
}

export function deleteAuthorLocal(id) {
  const store = readStore();
  if (!store.authors[id]) return false;
  delete store.authors[id];
  writeStore(store);
  return true;
}

export function listTagsLocal() {
  const store = readStore();
  return Object.values(store.tags)
    .map(normalizeTag)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.name.localeCompare(b.name));
}

export function upsertTagLocal(tag) {
  const store = readStore();
  const normalized = normalizeTag(tag);
  store.tags[normalized.id] = normalized;
  writeStore(store);
  return normalized;
}

export function deleteTagLocal(id) {
  const store = readStore();
  if (!store.tags[id]) return false;
  delete store.tags[id];
  writeStore(store);
  return true;
}
