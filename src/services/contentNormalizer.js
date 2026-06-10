/**
 * Normalização do contrato de conteúdo institucional para o front.
 *
 * @typedef {'text' | 'subtitle' | 'image' | 'youtube' | 'link' | 'table'} BlockType
 *
 * @typedef {Object} TextBlockPayload
 * @property {string} html
 *
 * @typedef {Object} SubtitleBlockPayload
 * @property {string} text
 *
 * @typedef {Object} ImageBlockPayload
 * @property {string} src
 * @property {string} [alt]
 * @property {string} [caption]
 * @property {number} [widthPercent] — largura no site (% da coluna, 10–100; padrão 100)
 * @property {boolean} [standardSize] — legado; migrado para widthPercent 25
 * @property {boolean} [inGallery] — se true (padrão), imagens seguidas viram galeria
 *
 * @typedef {Object} YoutubeBlockPayload
 * @property {string} videoId
 * @property {number} [widthPercent] — largura no site (% da coluna, 10–100; padrão 100)
 *
 * @typedef {Object} LinkBlockPayload
 * @property {string} label
 * @property {string} href
 * @property {boolean} [openInNewTab]
 *
 * @typedef {Object} TableBlockPayload
 * @property {string[]} headers
 * @property {{ cells: string[] }[]} rows — objetos (Firestore não aceita array dentro de array)
 * @property {string} [caption]
 * @property {number} [widthPercent]
 *
 * @typedef {Object} ContentBlock
 * @property {string} [id]
 * @property {BlockType} type
 * @property {number} [position]
 * @property {TextBlockPayload | SubtitleBlockPayload | ImageBlockPayload | YoutubeBlockPayload | LinkBlockPayload | TableBlockPayload} payload
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
 * @property {string} [lastEditedBy]
 * @property {string} [lastEditedByEmail]
 * @property {string} [lastEditedAt]
 * @property {number} [contentRevision] — incrementa a cada salvamento (controle de conflito)
 */

/**
 * @param {unknown} value
 * @returns {string|undefined}
 */
export function normalizeEditedAt(value) {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    try {
      return /** @type {{ toDate: () => Date }} */ (value).toDate().toISOString();
    } catch {
      return undefined;
    }
  }
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    const sec = /** @type {{ seconds: number }} */ (value).seconds;
    return new Date(sec * 1000).toISOString();
  }
  return undefined;
}

export const DEFAULT_PARALLAX = 'https://i.imgur.com/vF5SgMB.png';

/** @type {{ value: number, label: string }[]} */
export const IMAGE_WIDTH_PRESETS = [
  { value: 100, label: 'Largura total (100%)' },
  { value: 75, label: '75%' },
  { value: 50, label: '50%' },
  { value: 33, label: '33%' },
  { value: 25, label: '25%' },
];

/**
 * Largura da imagem no site (% da coluna de conteúdo, 10–100).
 * @param {Record<string, unknown>|undefined|null} payload
 */
export function normalizeImageWidthPercent(payload) {
  if (payload?.widthPercent != null && payload.widthPercent !== '') {
    const n = Number(payload.widthPercent);
    if (!Number.isNaN(n)) return Math.min(100, Math.max(10, Math.round(n)));
  }
  if (payload?.standardSize === true) return 25;
  return 100;
}

/**
 * @param {Record<string, unknown>|undefined|null} payload
 */
export function normalizeImageInGallery(payload) {
  return payload?.inGallery !== false;
}

/**
 * @param {{ type?: string, payload?: Record<string, unknown> }} block
 */
export function imageBlockInGallery(block) {
  return block?.type === 'image' && !!block.payload?.src && normalizeImageInGallery(block.payload);
}

/**
 * @param {string} text
 */
export function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Converte texto simples em HTML (Enter = nova linha; linha em branco = parágrafo).
 * @param {string} text
 */
export function plainTextToHtml(text) {
  const raw = String(text ?? '');
  if (!raw.trim()) return '';
  const paragraphs = raw.replace(/\r\n/g, '\n').split(/\n{2,}/);
  return paragraphs
    .map((para) => {
      const escaped = escapeHtml(para).replace(/\n/g, '<br>');
      return `<p>${escaped || '&nbsp;'}</p>`;
    })
    .join('');
}

/**
 * Extrai texto simples de HTML básico (para edição no admin).
 * @param {string} html
 */
export function htmlToPlainText(html) {
  let s = String(html || '');
  if (!s.trim()) return '';
  s = s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<\/div>\s*<div[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  return s.replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '');
}

/**
 * @param {string} text
 */
export function looksLikeHtmlContent(text) {
  return /<(p|br|div|ul|ol|li|h[1-6]|table|strong|em|a|span)\b/i.test(String(text || ''));
}

/**
 * Garante HTML exibível: converte quebras de linha se não houver tags HTML.
 * @param {string} raw
 */
export function formatTextBlockHtml(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (looksLikeHtmlContent(s)) return s;
  return plainTextToHtml(s);
}

/**
 * @param {unknown} row
 * @param {number} colCount
 * @returns {{ cells: string[] }}
 */
function normalizeTableRow(row, colCount) {
  /** @type {string[]} */
  let cells = [];
  if (Array.isArray(row)) {
    cells = row.map((cell) => String(cell ?? ''));
  } else if (row && typeof row === 'object' && Array.isArray(/** @type {{ cells?: unknown[] }} */ (row).cells)) {
    cells = /** @type {{ cells: unknown[] }} */ (row).cells.map((cell) => String(cell ?? ''));
  }
  while (cells.length < colCount) cells.push('');
  return { cells: cells.slice(0, colCount) };
}

/**
 * @param {Record<string, unknown>|undefined|null} payload
 */
export function normalizeTablePayload(payload) {
  const rawHeaders = Array.isArray(payload?.headers) ? payload.headers : ['Coluna 1', 'Coluna 2'];
  const headers = rawHeaders.length
    ? rawHeaders.map((cell) => String(cell ?? ''))
    : ['Coluna 1'];
  const colCount = headers.length;

  const rawRows = Array.isArray(payload?.rows) ? payload.rows : [];
  const rows = rawRows.map((row) => normalizeTableRow(row, colCount));

  return {
    headers,
    rows,
    caption: payload?.caption ? String(payload.caption) : '',
    widthPercent: normalizeImageWidthPercent(payload),
  };
}

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
/**
 * Normaliza URL externa (http/https). Retorna string vazia se inválida.
 * @param {string} href
 */
export function normalizeExternalHref(href) {
  const trimmed = (href || '').trim();
  if (!trimmed) return '';
  try {
    const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.href;
  } catch {
    return '';
  }
}

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
        payload: { html: formatTextBlockHtml(String(payload.html || '')) },
      };
    case 'subtitle': {
      const text = String(payload.text || '').trim();
      if (!text) return null;
      return {
        id: block.id ? String(block.id) : undefined,
        type: 'subtitle',
        position,
        payload: { text },
      };
    }
    case 'image':
      return {
        id: block.id ? String(block.id) : undefined,
        type: 'image',
        position,
        payload: {
          src: String(payload.src || payload.url || ''),
          alt: payload.alt ? String(payload.alt) : '',
          caption: payload.caption ? String(payload.caption) : undefined,
          widthPercent: normalizeImageWidthPercent(payload),
          inGallery: normalizeImageInGallery(payload),
        },
      };
    case 'youtube': {
      const videoId = String(payload.videoId || payload.embedId || '');
      if (!videoId) return null;
      return {
        id: block.id ? String(block.id) : undefined,
        type: 'youtube',
        position,
        payload: {
          videoId,
          widthPercent: normalizeImageWidthPercent(payload),
        },
      };
    }
    case 'link': {
      const href = normalizeExternalHref(String(payload.href || payload.url || ''));
      const label = String(payload.label || payload.text || '').trim();
      if (!href || !label) return null;
      const openInNewTab = payload.openInNewTab !== false;
      return {
        id: block.id ? String(block.id) : undefined,
        type: 'link',
        position,
        payload: { label, href, openInNewTab },
      };
    }
    case 'table': {
      const table = normalizeTablePayload(payload);
      if (!table.headers.length) return null;
      return {
        id: block.id ? String(block.id) : undefined,
        type: 'table',
        position,
        payload: table,
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

  const normalized = {
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

  if (page.lastEditedBy) normalized.lastEditedBy = String(page.lastEditedBy);
  if (page.lastEditedByEmail) normalized.lastEditedByEmail = String(page.lastEditedByEmail);
  const editedAt = normalizeEditedAt(page.lastEditedAt || page.updatedAt);
  if (editedAt) normalized.lastEditedAt = editedAt;

  if (typeof page.contentRevision === 'number' && !Number.isNaN(page.contentRevision)) {
    normalized.contentRevision = page.contentRevision;
  }

  return normalized;
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
