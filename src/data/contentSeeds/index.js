import kyokushinkaikan from './kyokushinkaikan.json';

/** Páginas institucionais com conteúdo original (layout legado). */
export const CONTENT_SEEDS = [kyokushinkaikan];

export const CONTENT_SEEDS_BY_SLUG = Object.fromEntries(
  CONTENT_SEEDS.map((page) => [page.slug, page])
);
