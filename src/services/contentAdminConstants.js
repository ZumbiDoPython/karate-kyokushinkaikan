import { ROUTE_SLUG_MAP } from './contentNormalizer';

import { EXCLUDED_INSTITUTIONAL_SLUGS } from '../utils/contentSchema';

/** Slugs institucionais conhecidos (exclui home e notícias). */
export const INSTITUTIONAL_PAGE_SLUGS = [
  ...new Set(
    Object.values(ROUTE_SLUG_MAP).filter(
      (s) => s && s !== 'home' && !EXCLUDED_INSTITUTIONAL_SLUGS.includes(s)
    )
  ),
];

export const PAGE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};
