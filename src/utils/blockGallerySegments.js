/** Mínimo de imagens consecutivas para agrupar em galeria (uma embaixo da outra). */
export const GALLERY_RUN_MIN = 2;

/**
 * @param {import('../services/contentNormalizer').ContentBlock} block
 */
function isGalleryEligibleImage(block) {
  if (block.type !== 'image' || !block.payload?.src) return false;
  return block.payload.inGallery !== false;
}

/**
 * Agrupa blocos: texto/vídeo inline; sequências de 2+ imagens seguidas (com inGallery) viram galeria.
 * @param {import('../services/contentNormalizer').ContentBlock[]} blocks
 * @param {number} [minRun]
 */
export function segmentBlocksForGallery(blocks, minRun = GALLERY_RUN_MIN) {
  /** @type {Array<{ kind: 'block', block: import('../services/contentNormalizer').ContentBlock } | { kind: 'gallery', blocks: import('../services/contentNormalizer').ContentBlock[] }>} */
  const segments = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    if (block.type !== 'image' || !block.payload?.src) {
      segments.push({ kind: 'block', block });
      i += 1;
      continue;
    }

    if (!isGalleryEligibleImage(block)) {
      segments.push({ kind: 'block', block });
      i += 1;
      continue;
    }

    const imageRun = [];
    while (i < blocks.length && isGalleryEligibleImage(blocks[i])) {
      imageRun.push(blocks[i]);
      i += 1;
    }

    if (imageRun.length >= minRun) {
      segments.push({ kind: 'gallery', blocks: imageRun });
    } else {
      imageRun.forEach((b) => segments.push({ kind: 'block', block: b }));
    }
  }

  return segments;
}
