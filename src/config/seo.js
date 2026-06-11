/** URL pública do site (domínio customizado ou Firebase Hosting). */
export const SITE_URL = (
  process.env.REACT_APP_SITE_URL || 'https://kyokushinkaikan-brasil.web.app'
).replace(/\/$/, '');

export const SITE_NAME = 'Kyokushinkaikan Brasil';
export const SITE_LOCALE = 'pt_BR';

export const DEFAULT_OG_IMAGE = 'https://i.imgur.com/vF5SgMB.png';

export const DEFAULT_SEO = {
  title: `${SITE_NAME} | Karate Full Contact`,
  description:
    'Confederação Brasileira de Karate Kyokushinkaikan. História, dojos, notícias, eventos, galeria e artes marciais no Brasil.',
  image: DEFAULT_OG_IMAGE,
  type: 'website',
};

/** SEO estático por rota pública (fallback antes do CMS carregar). */
export const ROUTE_SEO = {
  '/': {
    title: `${SITE_NAME} | Karate Full Contact no Brasil`,
    description:
      'Portal oficial do Karate Kyokushinkaikan no Brasil. Conheça a história, filiais, notícias e eventos da Confederação Brasileira.',
  },
  '/kyokushinkaikan': {
    title: 'Karate Kyokushinkaikan | História e Fundadores',
    description:
      'Conheça o Karate Kyokushinkaikan, Sosai Mas Oyama, Shihan José Koei Nagata e a história do estilo no Brasil.',
  },
  '/kickboxing': {
    title: 'Kickboxing | Kyokushinkaikan Brasil',
    description: 'Kickboxing na Confederação Brasileira de Karate Kyokushinkaikan.',
  },
  '/thai-boxing': {
    title: 'Muay Thai / Thai Boxing | Kyokushinkaikan Brasil',
    description: 'Thai Boxing na Confederação Brasileira de Karate Kyokushinkaikan.',
  },
  '/kobudo': {
    title: 'Kobudô | Kyokushinkaikan Brasil',
    description: 'Kobudô e artes marciais tradicionais no Kyokushinkaikan Brasil.',
  },
  '/galeria': {
    title: 'Galeria de Fotos | Kyokushinkaikan Brasil',
    description: 'Fotos de treinos, eventos e campeonatos de Karate Kyokushinkaikan no Brasil.',
  },
  '/produtos': {
    title: 'Produtos e Materiais | Kyokushinkaikan Brasil',
    description: 'Produtos oficiais e materiais do Karate Kyokushinkaikan no Brasil.',
  },
  '/noticias': {
    title: 'Notícias e Eventos | Kyokushinkaikan Brasil',
    description:
      'Últimas notícias, eventos e matérias do Karate Kyokushinkaikan no Brasil.',
  },
  '/contatos': {
    title: 'Contatos | Kyokushinkaikan Brasil',
    description: 'Entre em contato com a Confederação Brasileira de Karate Kyokushinkaikan.',
  },
  '/nagata-gym': {
    title: 'Nagata Gym | Kyokushinkaikan Brasil',
    description: 'Nagata Gym — filial e dojo Kyokushinkaikan.',
  },
  '/historia': {
    title: 'História | Kyokushinkaikan Brasil',
    description: 'História do Karate Kyokushinkaikan e sua trajetória no Brasil.',
  },
  '/mestres': {
    title: 'Mestres | Kyokushinkaikan Brasil',
    description: 'Mestres e liderança do Karate Kyokushinkaikan no Brasil.',
  },
  '/filosofia': {
    title: 'Filosofia | Kyokushinkaikan Brasil',
    description: 'Filosofia e princípios do Karate Kyokushinkaikan.',
  },
};

/**
 * @param {string} slug
 */
export function slugToPublicPath(slug) {
  /** @type {Record<string, string>} */
  const map = {
    home: '/',
    kyokushinkaikan: '/kyokushinkaikan',
    kickboxing: '/kickboxing',
    'thai-boxing': '/thai-boxing',
    kobudo: '/kobudo',
    galeria: '/galeria',
    produtos: '/produtos',
    contatos: '/contatos',
    'nagata-gym': '/nagata-gym',
    historia: '/historia',
    mestres: '/mestres',
    filosofia: '/filosofia',
    noticias: '/noticias',
  };
  return map[slug] || `/${slug}`;
}

/** Rotas públicas para sitemap.xml */
export const PUBLIC_SITEMAP_PATHS = Object.keys(ROUTE_SEO);

/**
 * @param {string} [path]
 */
export function buildCanonicalUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * @param {string} title
 */
export function buildPageTitle(title) {
  const t = (title || '').trim();
  if (!t) return DEFAULT_SEO.title;
  if (t.toLowerCase().includes('kyokushinkaikan')) return t;
  return `${t} | ${SITE_NAME}`;
}

/**
 * @param {string} text
 * @param {number} [max]
 */
export function truncateDescription(text, max = 160) {
  const clean = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return DEFAULT_SEO.description;
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

/**
 * @param {string} pathname
 */
export function getRouteSeo(pathname) {
  if (ROUTE_SEO[pathname]) return ROUTE_SEO[pathname];
  if (pathname.startsWith('/noticias/') && pathname !== '/noticias') {
    return {
      title: `Matéria | ${SITE_NAME}`,
      description: DEFAULT_SEO.description,
      type: 'article',
    };
  }
  return DEFAULT_SEO;
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: SITE_NAME,
    url: SITE_URL,
    sport: 'Karate',
    areaServed: {
      '@type': 'Country',
      name: 'Brasil',
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/noticias?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * @param {import('../services/newsNormalizer').Article} article
 * @param {string} url
 * @param {string} [authorName]
 */
export function buildArticleJsonLd(article, url, authorName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: truncateDescription(article.excerpt || article.title),
    datePublished: article.publishedAt,
    dateModified: article.lastEditedAt || article.publishedAt,
    mainEntityOfPage: url,
    image: article.coverImage ? [article.coverImage] : undefined,
    author: authorName
      ? { '@type': 'Person', name: authorName }
      : { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
