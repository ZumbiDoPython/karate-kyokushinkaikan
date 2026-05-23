/**
 * Normalização do contrato de conteúdo institucional para o front.
 *
 * @typedef {'text' | 'image' | 'youtube'} BlockType
 *
 * @typedef {Object} TextBlockPayload
 * @property {string} html
 *
 * @typedef {Object} ImageBlockPayload
 * @property {string} src
 * @property {string} [alt]
 * @property {string} [caption]
 *
 * @typedef {Object} YoutubeBlockPayload
 * @property {string} videoId
 *
 * @typedef {Object} ContentBlock
 * @property {string} [id]
 * @property {BlockType} type
 * @property {number} [position]
 * @property {TextBlockPayload | ImageBlockPayload | YoutubeBlockPayload} payload
 *
 * @typedef {Object} ContentSection
 * @property {string} id
 * @property {string} [pageId]
 * @property {string|null} [parentId]
 * @property {string} title
 * @property {string} [subtitle]
 * @property {number} [position]
 * @property {ContentBlock[]} blocks
 * @property {ContentSection[]} children
 *
 * @typedef {Object} ContentPage
 * @property {string} [id]
 * @property {string} slug
 * @property {string} title
 * @property {string} [subtitle]
 * @property {'draft'|'published'} [status]
 * @property {number} [position]
 * @property {ContentSection[]} sections
 * @property {string} [parallaxImage]
 */

export const DEFAULT_PARALLAX = 'https://i.imgur.com/vF5SgMB.png';

/** Slug da rota React → slug no CMS de conteúdo */
export const ROUTE_SLUG_MAP = {
  '/': 'home',
  '/kyokushinkaikan': 'kyokushinkaikan',
  '/kickboxing': 'kickboxing',
  '/thai-boxing': 'thai-boxing',
  '/kobudo': 'kobudo',
  '/galeria': 'galeria',
  '/produtos': 'produtos',
  '/contatos': 'contatos',
  '/nagata-gym': 'nagata-gym',
  '/historia': 'historia',
  '/mestres': 'mestres',
  '/filosofia': 'filosofia',
  '/noticias': 'noticias',
};

/**
 * @param {string} text
 */
export function slugify(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'secao';
}

/**
 * @param {string} url
 * @returns {string|null}
 */
export function extractYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/v\/([^?&/]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/**
 * @param {Array<{ position?: number }>} items
 */
export function sortByPosition(items) {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

/**
 * @param {Partial<ContentBlock>} block
 * @param {number} index
 * @returns {ContentBlock|null}
 */
export function normalizeBlock(block, index = 0) {
  if (!block?.type) return null;

  const position = typeof block.position === 'number' ? block.position : index;
  const payload = block.payload || {};

  switch (block.type) {
    case 'text':
      return {
        id: block.id ? String(block.id) : undefined,
        type: 'text',
        position,
        payload: { html: String(payload.html || '') },
      };
    case 'image':
      return {
        id: block.id ? String(block.id) : undefined,
        type: 'image',
        position,
        payload: {
          src: String(payload.src || payload.url || ''),
          alt: payload.alt ? String(payload.alt) : '',
          caption: payload.caption ? String(payload.caption) : undefined,
        },
      };
    case 'youtube': {
      const videoId = String(payload.videoId || payload.embedId || '');
      if (!videoId) return null;
      return {
        id: block.id ? String(block.id) : undefined,
        type: 'youtube',
        position,
        payload: { videoId },
      };
    }
    default:
      return null;
  }
}

/**
 * @param {Partial<ContentSection>} section
 * @param {number} index
 * @returns {ContentSection}
 */
export function normalizeSection(section, index = 0) {
  const position = typeof section.position === 'number' ? section.position : index;
  const id = section.id ? String(section.id) : slugify(section.title) || `secao-${index}`;
  const nestedChildren = Array.isArray(section.children) ? section.children : [];

  const blocks = sortByPosition(section.blocks || [])
    .map((block, i) => normalizeBlock(block, i))
    .filter(Boolean);

  const children = sortByPosition(nestedChildren)
    .map((child, i) => normalizeSection(child, i));

  return {
    id,
    pageId: section.pageId ? String(section.pageId) : undefined,
    parentId: section.parentId != null ? String(section.parentId) : null,
    title: String(section.title || ''),
    subtitle: section.subtitle ? String(section.subtitle) : undefined,
    position,
    blocks,
    children,
  };
}

/**
 * Converte lista plana de seções (parentId) em árvore.
 * @param {Partial<ContentSection>[]} flatSections
 */
export function buildSectionTree(flatSections) {
  const normalized = sortByPosition(flatSections).map((s, i) => normalizeSection({ ...s, children: [] }, i));
  const byId = new Map(normalized.map((s) => [s.id, { ...s, children: [] }]));
  /** @type {ContentSection[]} */
  const roots = [];

  normalized.forEach((section) => {
    const node = byId.get(section.id);
    if (!node) return;

    if (section.parentId && byId.has(section.parentId)) {
      byId.get(section.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  roots.forEach((root) => {
    root.children = sortByPosition(root.children);
  });

  return sortByPosition(roots);
}

/**
 * @param {Partial<ContentSection>[]} sections
 */
function normalizeSections(sections) {
  if (!Array.isArray(sections) || !sections.length) return [];

  const hasParentRefs = sections.some((s) => s.parentId != null && s.parentId !== '');
  const hasNested = sections.some((s) => Array.isArray(s.children) && s.children.length > 0);

  if (hasNested) {
    return sortByPosition(sections).map((s, i) => normalizeSection(s, i));
  }

  if (hasParentRefs) {
    return buildSectionTree(sections);
  }

  return sortByPosition(sections).map((s, i) => normalizeSection(s, i));
}

/**
 * @param {Partial<ContentPage>} page
 * @returns {ContentPage}
 */
export function normalizePage(page) {
  const slug = String(page.slug || 'pagina');
  const sections = normalizeSections(page.sections || []);
  const parallaxImage =
    page.parallaxImage ||
    findFirstImage(sections) ||
    DEFAULT_PARALLAX;

  return {
    id: page.id ? String(page.id) : undefined,
    slug,
    title: String(page.title || slugToTitle(slug)),
    subtitle: page.subtitle ? String(page.subtitle) : undefined,
    status: page.status === 'published' ? 'published' : 'draft',
    position: typeof page.position === 'number' ? page.position : 0,
    parallaxImage,
    sections: sections.length
      ? sections
      : [createDefaultSection(slug)],
  };
}

/**
 * @param {unknown} data
 * @returns {ContentPage}
 */
export function mapApiResponseToPage(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Resposta inválida da API de conteúdo');
  }

  const raw = /** @type {Record<string, unknown>} */ (data);
  const page = raw.page && typeof raw.page === 'object' ? raw.page : raw;

  return normalizePage({
    id: page.id,
    slug: page.slug,
    title: page.title,
    subtitle: page.subtitle,
    position: page.position,
    parallaxImage: page.parallaxImage,
    sections: page.sections,
  });
}

/**
 * @param {string} slug
 * @returns {ContentPage}
 */
export function createEmptyPage(slug) {
  return normalizePage({
    slug,
    title: slugToTitle(slug),
    sections: [createDefaultSection(slug)],
  });
}

/**
 * @param {string} slug
 */
function createDefaultSection(slug) {
  return {
    id: 'conteudo',
    title: slugToTitle(slug),
    position: 0,
    blocks: [],
    children: [],
  };
}

/**
 * @param {string} slug
 */
function slugToTitle(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * @param {ContentSection[]} sections
 */
function findFirstImage(sections) {
  for (const section of sections) {
    const imageBlock = section.blocks.find((b) => b.type === 'image');
    if (imageBlock?.type === 'image' && imageBlock.payload.src) {
      return imageBlock.payload.src;
    }
    for (const child of section.children) {
      const childImage = child.blocks.find((b) => b.type === 'image');
      if (childImage?.type === 'image' && childImage.payload.src) {
        return childImage.payload.src;
      }
    }
  }
  return null;
}

/**
 * @param {string} route
 */
export function getSlugFromRoute(route) {
  return ROUTE_SLUG_MAP[route] || route.replace(/^\//, '').replace(/\//g, '-') || 'home';
}

const contentNormalizer = {
  normalizePage,
  normalizeSection,
  normalizeBlock,
  mapApiResponseToPage,
  createEmptyPage,
  buildSectionTree,
  sortByPosition,
  ROUTE_SLUG_MAP,
  getSlugFromRoute,
  slugify,
  extractYoutubeId,
  DEFAULT_PARALLAX,
};

export default contentNormalizer;
