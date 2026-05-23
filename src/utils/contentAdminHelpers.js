import { slugify, sortByPosition, extractYoutubeId } from '../services/contentNormalizer';

/**
 * @returns {string}
 */
export function generateTempId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * @template T extends { position?: number }
 * @param {T[]} items
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {T[]}
 */
export function reorderByIndex(items, fromIndex, toIndex) {
  const list = [...items];
  const [removed] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, removed);
  return list.map((item, index) => ({ ...item, position: index }));
}

/**
 * @param {import('../services/contentNormalizer').ContentBlock} block
 */
export function getYoutubeEmbedId(block) {
  if (block.type !== 'youtube') return '';
  const p = block.payload || {};
  return p.videoId || p.embedId || '';
}

/**
 * @param {string} value URL ou ID
 */
export function parseYoutubeEmbedId(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  return extractYoutubeId(trimmed) || trimmed;
}

/**
 * @param {import('../services/contentNormalizer').ContentSection[]} sections
 */
export function assignSectionPositions(sections) {
  const list = Array.isArray(sections) ? sections : [];
  return sortByPosition(list).map((section, index) => ({
    ...section,
    position: index,
    id: section.id || slugify(section.title) || generateTempId('sec'),
    blocks: assignBlockPositions(section.blocks || []),
    children: assignSectionPositions(section.children || []),
  }));
}

/**
 * @param {import('../services/contentNormalizer').ContentBlock[]} blocks
 */
export function assignBlockPositions(blocks) {
  const list = Array.isArray(blocks) ? blocks : [];
  return sortByPosition(list).map((block, index) => ({
    ...block,
    position: index,
    id: block.id || generateTempId('blk'),
  }));
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 */
export function serializePageForApi(page) {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    subtitle: page.subtitle || '',
    parallaxImage: page.parallaxImage || '',
    status: page.status || 'draft',
    position: page.position ?? 0,
    sections: assignSectionPositions(page.sections || []),
  };
}

/**
 * @param {import('../services/contentNormalizer').ContentSection} overrides
 */
export function createEmptySection(overrides = {}) {
  return {
    id: generateTempId('sec'),
    title: '',
    subtitle: '',
    position: 0,
    parentId: null,
    blocks: [],
    children: [],
    ...overrides,
  };
}

/**
 * @param {'text'|'image'|'youtube'} type
 * @param {number} position
 */
export function createEmptyBlock(type, position = 0) {
  const base = { id: generateTempId('blk'), type, position };

  switch (type) {
    case 'text':
      return { ...base, payload: { html: '<p></p>' } };
    case 'image':
      return { ...base, payload: { src: '', alt: '', caption: '' } };
    case 'youtube':
      return { ...base, payload: { videoId: '', embedId: '' } };
    default:
      return { ...base, payload: {} };
  }
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} sectionId
 */
export function findSectionById(page, sectionId) {
  /** @type {import('../services/contentNormalizer').ContentSection|null} */
  let found = null;

  const walk = (sections) => {
    for (const s of sections) {
      if (s.id === sectionId) {
        found = s;
        return;
      }
      walk(s.children || []);
    }
  };

  walk(page.sections || []);
  return found;
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} sectionId
 * @param {import('../services/contentNormalizer').ContentSection} updated
 */
export function updateSectionInPage(page, sectionId, updated) {
  const patch = (sections) =>
    sections.map((s) => {
      if (s.id === sectionId) return { ...s, ...updated };
      return { ...s, children: patch(s.children || []) };
    });

  return { ...page, sections: patch(page.sections || []) };
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string|null} parentId
 * @param {import('../services/contentNormalizer').ContentSection} section
 */
export function addSectionToPage(page, parentId, section) {
  if (!parentId) {
    const sections = [...(page.sections || []), { ...section, position: page.sections?.length || 0 }];
    return { ...page, sections: assignSectionPositions(sections) };
  }

  const patch = (sections) =>
    sections.map((s) => {
      if (s.id === parentId) {
        const children = [...(s.children || []), { ...section, position: s.children?.length || 0 }];
        return { ...s, children: assignSectionPositions(children) };
      }
      return { ...s, children: patch(s.children || []) };
    });

  return { ...page, sections: patch(page.sections || []) };
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} sectionId
 */
export function removeSectionFromPage(page, sectionId) {
  const filter = (sections) =>
    sections
      .filter((s) => s.id !== sectionId)
      .map((s) => ({ ...s, children: filter(s.children || []) }));

  return { ...page, sections: assignSectionPositions(filter(page.sections || [])) };
}
