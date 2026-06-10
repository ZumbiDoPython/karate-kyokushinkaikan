import { slugify, sortByPosition, normalizeBlock, normalizeEditedAt } from './contentNormalizer';

/**
 * @typedef {'news' | 'event'} ArticleType
 * @typedef {'draft' | 'published'} ArticleStatus
 *
 * @typedef {Object} ArticleAuthor
 * @property {string} id
 * @property {string} name
 * @property {string} [photo]
 * @property {string} [bio]
 * @property {number} [position]
 *
 * @typedef {Object} ArticleTag
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {number} [position]
 *
 * @typedef {Object} Article
 * @property {string} id
 * @property {string} slug
 * @property {ArticleType} type
 * @property {string} title
 * @property {string} [excerpt]
 * @property {string} [coverImage]
 * @property {import('./contentNormalizer').ContentBlock[]} blocks
 * @property {string} publishedAt
 * @property {ArticleStatus} status
 * @property {string} [authorId]
 * @property {string[]} tagIds
 * @property {string} [eventDate]
 * @property {string} [eventLocation]
 * @property {number} [contentRevision]
 * @property {string} [lastEditedBy]
 * @property {string} [lastEditedByEmail]
 * @property {string} [lastEditedAt]
 */

/**
 * @param {unknown} value
 */
export function normalizePublishedAt(value) {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string' && value.trim()) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    try {
      return /** @type {{ toDate: () => Date }} */ (value).toDate().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    return new Date(/** @type {{ seconds: number }} */ (value).seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

/**
 * @param {Partial<ArticleAuthor>} author
 */
export function normalizeAuthor(author) {
  const id = String(author.id || slugify(author.name) || `author-${Date.now()}`);
  return {
    id,
    name: String(author.name || '').trim(),
    photo: author.photo ? String(author.photo) : '',
    bio: author.bio ? String(author.bio) : '',
    position: typeof author.position === 'number' ? author.position : 0,
  };
}

/**
 * @param {Partial<ArticleTag>} tag
 */
export function normalizeTag(tag) {
  const name = String(tag.name || '').trim();
  const slug = tag.slug ? String(tag.slug) : slugify(name) || `tag-${Date.now()}`;
  return {
    id: String(tag.id || slug),
    name,
    slug,
    position: typeof tag.position === 'number' ? tag.position : 0,
  };
}

/**
 * @param {import('./contentNormalizer').ContentBlock[]} blocks
 */
export function collectArticleImages(blocks) {
  /** @type {{ src: string, alt: string }[]} */
  const images = [];
  (blocks || []).forEach((block) => {
    if (block.type === 'image' && block.payload?.src) {
      images.push({ src: block.payload.src, alt: block.payload.alt || '' });
    }
  });
  return images;
}

/**
 * @param {unknown} blocks
 * @returns {unknown[]}
 */
function ensureBlockArray(blocks) {
  if (Array.isArray(blocks)) return blocks.filter(Boolean);
  if (blocks && typeof blocks === 'object') {
    return Object.values(blocks).filter(Boolean);
  }
  return [];
}

/**
 * @param {Partial<Article>} article
 */
export function normalizeArticle(article) {
  const slug = String(article.slug || slugify(article.title) || 'materia');
  const blocks = sortByPosition(ensureBlockArray(article.blocks))
    .map((b, i) => normalizeBlock(b, i))
    .filter(Boolean);

  const type = article.type === 'event' ? 'event' : 'news';
  const tagIds = Array.isArray(article.tagIds)
    ? article.tagIds.map(String).filter(Boolean)
    : [];

  return {
    id: article.id ? String(article.id) : slug,
    slug,
    type,
    title: String(article.title || slug),
    excerpt: article.excerpt ? String(article.excerpt) : '',
    coverImage: article.coverImage ? String(article.coverImage) : '',
    blocks,
    publishedAt: normalizePublishedAt(article.publishedAt),
    status: article.status === 'published' ? 'published' : 'draft',
    authorId: article.authorId ? String(article.authorId) : '',
    tagIds,
    eventDate: article.eventDate ? String(article.eventDate) : '',
    eventLocation: article.eventLocation ? String(article.eventLocation) : '',
    contentRevision:
      typeof article.contentRevision === 'number' ? article.contentRevision : 0,
    lastEditedBy: article.lastEditedBy ? String(article.lastEditedBy) : '',
    lastEditedByEmail: article.lastEditedByEmail ? String(article.lastEditedByEmail) : '',
    lastEditedAt: normalizeEditedAt(article.lastEditedAt) || '',
  };
}

/**
 * @returns {Article}
 */
export function createEmptyArticle(type = 'news') {
  return normalizeArticle({
    id: '',
    slug: '',
    type,
    title: '',
    excerpt: '',
    coverImage: '',
    blocks: [],
    publishedAt: new Date().toISOString(),
    status: 'draft',
    authorId: '',
    tagIds: [],
    eventDate: '',
    eventLocation: '',
    contentRevision: 0,
  });
}

/**
 * @param {string} iso
 */
export function formatArticleDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * @param {string} iso
 */
export function toDatetimeLocalValue(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

/**
 * @param {string} localValue
 */
export function fromDatetimeLocalValue(localValue) {
  if (!localValue || !localValue.trim()) return new Date().toISOString();
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}
