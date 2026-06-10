/**
 * Validação do contrato de conteúdo institucional.
 */

import { extractYoutubeId, normalizeExternalHref, normalizeImageWidthPercent, normalizeTablePayload, formatTextBlockHtml } from '../services/contentNormalizer';

/** Slug excluído do fluxo institucional / admin de conteúdo */
export const EXCLUDED_INSTITUTIONAL_SLUGS = ['noticias'];

/** Rótulo de profundidade para mensagens (h1 = página; seções começam em h2). */
export function getSectionDepthLabel(depth) {
  const headingLevel = Math.min(depth + 2, 6);
  if (depth === 0) return 'Seção (h2)';
  return `Subseção (h${headingLevel})`;
}

export const ALLOWED_BLOCK_TYPES = ['text', 'subtitle', 'image', 'youtube', 'link', 'table'];

/**
 * @typedef {Object} ValidationIssue
 * @property {string} path
 * @property {string} message
 * @property {string} [code]
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid
 * @property {ValidationIssue[]} errors
 * @property {ValidationIssue[]} warnings
 * @property {import('../services/contentNormalizer').ContentPage|null} sanitizedPage
 */

/**
 * @param {string} slug
 */
export function isExcludedInstitutionalSlug(slug) {
  return EXCLUDED_INSTITUTIONAL_SLUGS.includes((slug || '').toLowerCase());
}

/**
 * @param {string} slug
 */
export function isInstitutionalSlug(slug) {
  return slug && !isExcludedInstitutionalSlug(slug);
}

/**
 * @param {unknown} block
 * @param {string} path
 * @param {ValidationIssue[]} errors
 * @param {ValidationIssue[]} warnings
 */
function validateBlock(block, path, errors, warnings) {
  if (!block || typeof block !== 'object') {
    errors.push({ path, message: 'Bloco inválido ou ausente.', code: 'block.invalid' });
    return false;
  }

  const b = /** @type {Record<string, unknown>} */ (block);
  const type = b.type;

  if (!ALLOWED_BLOCK_TYPES.includes(type)) {
    errors.push({
      path,
      message: `Tipo de bloco "${type}" não é permitido. Use: text, subtitle, image, youtube, link ou table.`,
      code: 'block.type',
    });
    return false;
  }

  const payload = b.payload && typeof b.payload === 'object' ? b.payload : {};

  if (type === 'text') {
    if (payload.html == null || String(payload.html).trim() === '') {
      warnings.push({
        path,
        message: 'Bloco de texto vazio — não será exibido no site.',
        code: 'block.text.empty',
      });
    }
    return true;
  }

  if (type === 'subtitle') {
    if (!String(payload.text || '').trim()) {
      warnings.push({
        path,
        message: 'Subtítulo vazio — não será exibido no site.',
        code: 'block.subtitle.empty',
      });
    }
    return true;
  }

  if (type === 'image') {
    const src = String(payload.src || payload.url || '').trim();
    if (!src) {
      warnings.push({
        path,
        message: 'Imagem sem URL (src) — bloco oculto no site.',
        code: 'block.image.no_src',
      });
      return false;
    }
    return true;
  }

  if (type === 'youtube') {
    const raw = String(payload.videoId || payload.embedId || '').trim();
    const videoId = extractYoutubeId(raw) || raw;
    if (!videoId) {
      warnings.push({
        path,
        message: 'YouTube sem embedId válido — bloco oculto no site.',
        code: 'block.youtube.no_id',
      });
      return false;
    }
    return true;
  }

  if (type === 'link') {
    const label = String(payload.label || payload.text || '').trim();
    const href = normalizeExternalHref(String(payload.href || payload.url || ''));
    if (!label || !href) {
      warnings.push({
        path,
        message: 'Link externo sem texto ou URL válida — bloco oculto no site.',
        code: 'block.link.invalid',
      });
      return false;
    }
    return true;
  }

  if (type === 'table') {
    const table = normalizeTablePayload(payload);
    if (!table.rows.length) {
      warnings.push({
        path,
        message: 'Tabela sem linhas de dados — só o cabeçalho será exibido.',
        code: 'block.table.no_rows',
      });
    }
    return true;
  }

  return false;
}

/**
 * @param {unknown} section
 * @param {string} path
 * @param {number} depth
 * @param {ValidationIssue[]} errors
 * @param {ValidationIssue[]} warnings
 */
function validateSection(section, path, depth, errors, warnings) {
  if (!section || typeof section !== 'object') {
    errors.push({ path, message: 'Seção inválida.', code: 'section.invalid' });
    return;
  }

  const s = /** @type {Record<string, unknown>} */ (section);
  const id = String(s.id || '').trim();
  const title = String(s.title || '').trim();

  if (!id) {
    errors.push({
      path: `${path}.id`,
      message: `${getSectionDepthLabel(depth)}: o campo "id" é obrigatório.`,
      code: 'section.id',
    });
  }

  if (!title) {
    errors.push({
      path: `${path}.title`,
      message: `${getSectionDepthLabel(depth)}: o campo "título" é obrigatório.`,
      code: 'section.title',
    });
  }

  const blocks = Array.isArray(s.blocks) ? s.blocks : [];
  blocks.forEach((block, i) => {
    validateBlock(block, `${path}.blocks[${i}]`, errors, warnings);
  });

  const children = Array.isArray(s.children) ? s.children : [];
  children.forEach((child, i) => {
    validateSection(child, `${path}.children[${i}]`, depth + 1, errors, warnings);
  });
}

/**
 * @param {import('../services/contentNormalizer').ContentPage|null|undefined} page
 * @param {{ context?: 'institutional'|'render'|'admin' }} [options]
 * @returns {ValidationResult}
 */
export function validateContentPage(page, options = {}) {
  const { context = 'institutional' } = options;
  /** @type {ValidationIssue[]} */
  const errors = [];
  /** @type {ValidationIssue[]} */
  const warnings = [];

  if (!page || typeof page !== 'object') {
    return {
      valid: false,
      errors: [{ path: 'page', message: 'Página não encontrada.', code: 'page.missing' }],
      warnings: [],
      sanitizedPage: null,
    };
  }

  const slug = String(page.slug || '').trim().toLowerCase();

  if (context !== 'render' && isExcludedInstitutionalSlug(slug)) {
    errors.push({
      path: 'page.slug',
      message:
        'O slug "noticias" está excluído do editor institucional. Edite notícias em outro fluxo.',
      code: 'page.excluded',
    });
  }

  const title = String(page.title || '').trim();
  if (!title) {
    errors.push({
      path: 'page.title',
      message: 'A página institucional deve ter um título (h1).',
      code: 'page.title',
    });
  }

  const sections = Array.isArray(page.sections) ? page.sections : [];
  sections.forEach((section, i) => {
    validateSection(section, `sections[${i}]`, 0, errors, warnings);
  });

  const sanitizedPage = sanitizeContentPage(page);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitizedPage,
  };
}

/**
 * @param {unknown} block
 * @returns {import('../services/contentNormalizer').ContentBlock|null}
 */
function sanitizeBlock(block) {
  if (!block || typeof block !== 'object') return null;

  const b = /** @type {Record<string, unknown>} */ (block);
  const type = b.type;
  if (!ALLOWED_BLOCK_TYPES.includes(type)) return null;

  const payload = b.payload && typeof b.payload === 'object' ? b.payload : {};

  if (type === 'text') {
    const html = formatTextBlockHtml(String(payload.html || ''));
    if (!html) return null;
    return {
      id: b.id ? String(b.id) : undefined,
      type: 'text',
      position: typeof b.position === 'number' ? b.position : 0,
      payload: { html },
    };
  }

  if (type === 'subtitle') {
    const text = String(payload.text || '').trim();
    if (!text) return null;
    return {
      id: b.id ? String(b.id) : undefined,
      type: 'subtitle',
      position: typeof b.position === 'number' ? b.position : 0,
      payload: { text },
    };
  }

  if (type === 'image') {
    const src = String(payload.src || payload.url || '').trim();
    if (!src) return null;
    return {
      id: b.id ? String(b.id) : undefined,
      type: 'image',
      position: typeof b.position === 'number' ? b.position : 0,
      payload: {
        src,
        alt: payload.alt ? String(payload.alt) : '',
        caption: payload.caption ? String(payload.caption) : undefined,
        widthPercent: normalizeImageWidthPercent(payload),
        inGallery: payload.inGallery !== false,
      },
    };
  }

  if (type === 'youtube') {
    const raw = String(payload.videoId || payload.embedId || '').trim();
    const videoId = extractYoutubeId(raw) || raw;
    if (!videoId) return null;
    return {
      id: b.id ? String(b.id) : undefined,
      type: 'youtube',
      position: typeof b.position === 'number' ? b.position : 0,
      payload: {
        videoId,
        embedId: videoId,
        widthPercent: normalizeImageWidthPercent(payload),
      },
    };
  }

  if (type === 'link') {
    const label = String(payload.label || payload.text || '').trim();
    const href = normalizeExternalHref(String(payload.href || payload.url || ''));
    if (!label || !href) return null;
    return {
      id: b.id ? String(b.id) : undefined,
      type: 'link',
      position: typeof b.position === 'number' ? b.position : 0,
      payload: {
        label,
        href,
        openInNewTab: payload.openInNewTab !== false,
      },
    };
  }

  if (type === 'table') {
    const table = normalizeTablePayload(payload);
    if (!table.headers.length) return null;
    return {
      id: b.id ? String(b.id) : undefined,
      type: 'table',
      position: typeof b.position === 'number' ? b.position : 0,
      payload: table,
    };
  }

  return null;
}

/**
 * @param {unknown} section
 * @param {number} depth
 * @returns {import('../services/contentNormalizer').ContentSection|null}
 */
function sanitizeSection(section, depth) {
  if (!section || typeof section !== 'object') return null;

  const s = /** @type {Record<string, unknown>} */ (section);
  const id = String(s.id || '').trim();
  const title = String(s.title || '').trim();

  if (!id || !title) return null;

  const blocks = (Array.isArray(s.blocks) ? s.blocks : [])
    .map(sanitizeBlock)
    .filter(Boolean);

  const children = (Array.isArray(s.children) ? s.children : [])
    .map((child) => sanitizeSection(child, depth + 1))
    .filter(Boolean);

  return {
    id,
    title,
    subtitle: s.subtitle ? String(s.subtitle) : undefined,
    position: typeof s.position === 'number' ? s.position : 0,
    parentId: s.parentId != null ? String(s.parentId) : null,
    blocks,
    children,
  };
}

/**
 * @param {import('../services/contentNormalizer').ContentPage} page
 * @returns {import('../services/contentNormalizer').ContentPage}
 */
export function sanitizeContentPage(page) {
  const sections = (Array.isArray(page.sections) ? page.sections : [])
    .map((s) => sanitizeSection(s, 0))
    .filter(Boolean);

  return {
    ...page,
    title: String(page.title || '').trim() || page.slug || 'Página',
    sections,
  };
}

/**
 * Validação para o admin (bloqueia salvar se inválido).
 * @param {import('../services/contentNormalizer').ContentPage} page
 */
export function validateForAdmin(page) {
  return validateContentPage(page, { context: 'admin' });
}

/**
 * Validação para renderização pública (nunca quebra o layout).
 * @param {import('../services/contentNormalizer').ContentPage} page
 */
export function validateForRender(page) {
  return validateContentPage(page, { context: 'render' });
}

/**
 * Mensagens amigáveis agrupadas para o editor.
 * @param {ValidationResult} result
 */
export function formatValidationMessages(result) {
  const lines = [
    ...result.errors.map((e) => `Erro: ${e.message}`),
    ...result.warnings.map((w) => `Aviso: ${w.message}`),
  ];
  return lines;
}

const contentSchema = {
  EXCLUDED_INSTITUTIONAL_SLUGS,
  ALLOWED_BLOCK_TYPES,
  getSectionDepthLabel,
  isExcludedInstitutionalSlug,
  isInstitutionalSlug,
  validateContentPage,
  validateForAdmin,
  validateForRender,
  sanitizeContentPage,
  formatValidationMessages,
};

export default contentSchema;
