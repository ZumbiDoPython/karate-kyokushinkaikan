import { slugify, sortByPosition, extractYoutubeId } from '../services/contentNormalizer';
import { sanitizeForFirestore } from './firestoreSanitize';

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
  const payload = {
    id: page.id || page.slug,
    slug: page.slug,
    title: page.title,
    subtitle: page.subtitle || '',
    parallaxImage: page.parallaxImage || '',
    status: page.status || 'draft',
    position: page.position ?? 0,
    sections: assignSectionPositions(page.sections || []),
    lastEditedBy: page.lastEditedBy || '',
    lastEditedByEmail: page.lastEditedByEmail || '',
    lastEditedAt: page.lastEditedAt || new Date().toISOString(),
    contentRevision:
      typeof page.contentRevision === 'number' && !Number.isNaN(page.contentRevision)
        ? page.contentRevision
        : 0,
  };
  return /** @type {typeof payload} */ (sanitizeForFirestore(payload));
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {{ userId?: string|null, userEmail?: string|null, useFirebaseAuth?: boolean }} auth
 */
export function withEditorMetadata(page, auth) {
  const now = new Date().toISOString();
  if (auth?.useFirebaseAuth && auth.userId) {
    return {
      ...page,
      lastEditedBy: auth.userId,
      lastEditedByEmail: auth.userEmail || '',
      lastEditedAt: now,
    };
  }
  return {
    ...page,
    lastEditedBy: 'local',
    lastEditedByEmail: auth?.userEmail || 'admin-local',
    lastEditedAt: now,
  };
}

/**
 * @param {string|undefined} iso
 */
export function formatEditedAt(iso) {
  if (!iso) return '';
  try {
    /** @type {Date} */
    let date;
    if (typeof iso === 'object' && iso !== null && typeof iso.toDate === 'function') {
      date = iso.toDate();
    } else if (typeof iso === 'object' && iso !== null && 'seconds' in iso) {
      date = new Date(/** @type {{ seconds: number }} */ (iso).seconds * 1000);
    } else {
      date = new Date(iso);
    }
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return typeof iso === 'string' ? iso : '';
  }
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
 * @param {'text'|'image'|'youtube'|'link'} type
 * @param {number} position
 */
export function createEmptyBlock(type, position = 0) {
  const base = { id: generateTempId('blk'), type, position };

  switch (type) {
    case 'text':
      return { ...base, payload: { html: '' } };
    case 'subtitle':
      return { ...base, payload: { text: '' } };
    case 'image':
      return { ...base, payload: { src: '', alt: '', caption: '', widthPercent: 100, inGallery: true } };
    case 'youtube':
      return { ...base, payload: { videoId: '', widthPercent: 100 } };
    case 'link':
      return { ...base, payload: { label: 'Clique aqui', href: '', openInNewTab: true } };
    case 'table':
      return {
        ...base,
        payload: {
          headers: ['Coluna 1', 'Coluna 2'],
          rows: [{ cells: ['', ''] }, { cells: ['', ''] }],
          caption: '',
          widthPercent: 100,
        },
      };
    default:
      return { ...base, payload: {} };
  }
}

/**
 * @param {string} src
 * @param {number} [position]
 * @param {string} [alt]
 */
export function createImageBlock(src, position = 0, alt = '') {
  return {
    ...createEmptyBlock('image', position),
    payload: { src, alt, caption: '', widthPercent: 100, inGallery: true },
  };
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

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @returns {{ sectionId: string, label: string, depth: number }[]}
 */
export function flattenSectionsForPicker(page) {
  /** @type {{ sectionId: string, label: string, depth: number }[]} */
  const result = [];

  const walk = (sections, depth, pathPrefix) => {
    (sections || []).forEach((section) => {
      const label = pathPrefix ? `${pathPrefix} › ${section.title || section.id}` : section.title || section.id;
      result.push({ sectionId: section.id, label, depth });
      walk(section.children || [], depth + 1, label);
    });
  };

  walk(page.sections || [], 0, '');
  return result;
}

/**
 * @param {import('../services/contentNormalizer').ContentSection[]} sections
 * @param {string} sectionId
 * @param {(section: import('../services/contentNormalizer').ContentSection) => import('../services/contentNormalizer').ContentSection|null} mutator
 */
function mutateSectionById(sections, sectionId, mutator) {
  return sections.map((s) => {
    if (s.id === sectionId) {
      const next = mutator(s);
      return next === null ? null : next;
    }
    const children = mutateSectionById(s.children || [], sectionId, mutator);
    return { ...s, children };
  }).filter(Boolean);
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} blockId
 */
export function findBlockInPage(page, blockId) {
  /** @type {{ sectionId: string, index: number }|null} */
  let found = null;

  const walk = (sections) => {
    for (const section of sections || []) {
      const index = (section.blocks || []).findIndex((b) => b.id === blockId);
      if (index >= 0) {
        found = { sectionId: section.id, index };
        return;
      }
      walk(section.children || []);
      if (found) return;
    }
  };

  walk(page.sections || []);
  return found;
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} blockId
 * @param {string} targetSectionId
 * @param {number} [targetIndex]
 */
export function moveBlockInPage(page, blockId, targetSectionId, targetIndex) {
  const location = findBlockInPage(page, blockId);
  if (!location) return page;

  let movedBlock = null;

  const removeFromTree = (sections) =>
    mutateSectionById(sections, location.sectionId, (section) => {
      const blocks = [...(section.blocks || [])];
      const [removed] = blocks.splice(location.index, 1);
      movedBlock = removed;
      return { ...section, blocks: assignBlockPositions(blocks) };
    });

  if (!movedBlock) return page;

  let sectionsAfterRemove = removeFromTree(page.sections || []);
  if (!sectionsAfterRemove) return page;

  const insertIndex =
    typeof targetIndex === 'number'
      ? targetIndex
      : (findSectionById({ ...page, sections: sectionsAfterRemove }, targetSectionId)?.blocks?.length || 0);

  sectionsAfterRemove = mutateSectionById(sectionsAfterRemove, targetSectionId, (section) => {
    const blocks = [...(section.blocks || [])];
    const idx = Math.max(0, Math.min(insertIndex, blocks.length));
    blocks.splice(idx, 0, movedBlock);
    return { ...section, blocks: assignBlockPositions(blocks) };
  });

  return { ...page, sections: assignSectionPositions(sectionsAfterRemove || []) };
}

/**
 * Move todos os blocos de uma seção para outra (não move subseções).
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} sourceSectionId
 * @param {string} targetSectionId
 */
export function moveAllBlocksToSection(page, sourceSectionId, targetSectionId) {
  if (sourceSectionId === targetSectionId) return page;

  const source = findSectionById(page, sourceSectionId);
  const blocksToMove = [...(source?.blocks || [])];
  if (!blocksToMove.length) return page;

  let sections = mutateSectionById(page.sections || [], sourceSectionId, (section) => ({
    ...section,
    blocks: [],
  }));

  sections = mutateSectionById(sections, targetSectionId, (section) => ({
    ...section,
    blocks: assignBlockPositions([...(section.blocks || []), ...blocksToMove]),
  }));

  return { ...page, sections: assignSectionPositions(sections || []) };
}

export const SECTION_DRAG_MIME = 'application/x-kk-section';

/**
 * @param {DragEvent} e
 * @param {{ sectionId: string, parentId: string|null, siblingIndex: number }} data
 */
export function setSectionDragData(e, data) {
  e.dataTransfer.setData(SECTION_DRAG_MIME, JSON.stringify(data));
  e.dataTransfer.effectAllowed = 'move';
}

/**
 * @param {DragEvent} e
 * @returns {{ sectionId: string, parentId: string|null, siblingIndex: number }|null}
 */
export function getSectionDragData(e) {
  const raw = e.dataTransfer.getData(SECTION_DRAG_MIME);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} sectionId
 * @returns {string|null} null = seção na raiz
 */
export function findSectionParentId(page, sectionId) {
  /** @type {string|null} */
  let parentId = null;
  let found = false;

  const walk = (sections, parent) => {
    for (const s of sections || []) {
      if (s.id === sectionId) {
        parentId = parent;
        found = true;
        return;
      }
      walk(s.children || [], s.id);
      if (found) return;
    }
  };

  walk(page.sections || [], null);
  return parentId;
}

/**
 * @param {import('../services/contentNormalizer').ContentSection} section
 * @returns {Set<string>}
 */
export function getSectionDescendantIds(section) {
  /** @type {Set<string>} */
  const ids = new Set();
  const walk = (children) => {
    (children || []).forEach((child) => {
      ids.add(child.id);
      walk(child.children || []);
    });
  };
  walk(section.children || []);
  return ids;
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} ancestorSectionId
 * @param {string} maybeDescendantId
 */
export function isSectionDescendant(page, ancestorSectionId, maybeDescendantId) {
  if (ancestorSectionId === maybeDescendantId) return true;
  const ancestor = findSectionById(page, ancestorSectionId);
  if (!ancestor) return false;
  return getSectionDescendantIds(ancestor).has(maybeDescendantId);
}

/**
 * @param {import('../services/contentNormalizer').ContentSection[]} sections
 * @param {string} sectionId
 */
function extractSectionFromTree(sections, sectionId) {
  /** @type {import('../services/contentNormalizer').ContentSection|null} */
  let removed = null;

  const filter = (list) =>
    list
      .filter((s) => {
        if (s.id === sectionId) {
          removed = s;
          return false;
        }
        return true;
      })
      .map((s) => ({ ...s, children: filter(s.children || []) }));

  return { sections: filter(sections), removed };
}

/**
 * Move uma seção para outro pai (null = raiz) ou reordena entre irmãos.
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @param {string} sectionId
 * @param {string|null} targetParentId
 * @param {number} [targetIndex]
 */
export function moveSectionInPage(page, sectionId, targetParentId, targetIndex) {
  if (sectionId === targetParentId) return page;
  if (targetParentId && isSectionDescendant(page, sectionId, targetParentId)) return page;

  const { sections: without, removed } = extractSectionFromTree(page.sections || [], sectionId);
  if (!removed) return page;

  const moving = { ...removed };

  if (!targetParentId) {
    const roots = [...without];
    const idx =
      typeof targetIndex === 'number'
        ? Math.max(0, Math.min(targetIndex, roots.length))
        : roots.length;
    roots.splice(idx, 0, moving);
    return { ...page, sections: assignSectionPositions(roots) };
  }

  const insert = (list) =>
    list.map((s) => {
      if (s.id === targetParentId) {
        const children = [...(s.children || [])];
        const idx =
          typeof targetIndex === 'number'
            ? Math.max(0, Math.min(targetIndex, children.length))
            : children.length;
        children.splice(idx, 0, moving);
        return { ...s, children: assignSectionPositions(children) };
      }
      return { ...s, children: insert(s.children || []) };
    });

  return { ...page, sections: assignSectionPositions(insert(without)) };
}
