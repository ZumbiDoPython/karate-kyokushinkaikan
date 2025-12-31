const API_BASE_URL = 'https://kyokushinkaikan.com.br/wp-json/wp/v2';

/**
 * Função genérica para fazer requisições à API do WordPress
 */
const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Buscar todas as páginas
 */
export const getPages = async (params = {}) => {
  return fetchFromAPI('/pages', {
    per_page: 100,
    _embed: true, // Incluir dados relacionados (imagens, autor, etc)
    ...params
  });
};

/**
 * Buscar uma página específica por slug
 */
export const getPageBySlug = async (slug) => {
  try {
    const pages = await fetchFromAPI('/pages', { slug, per_page: 1, _embed: true });
    console.log('getPageBySlug result:', { slug, found: pages.length > 0, title: pages[0]?.title?.rendered });
    return pages.length > 0 ? pages[0] : null;
  } catch (error) {
    console.error('Error in getPageBySlug:', error);
    return null;
  }
};

/**
 * Buscar todas as postagens
 */
export const getPosts = async (params = {}) => {
  return fetchFromAPI('/posts', {
    per_page: 100,
    _embed: true, // Incluir dados relacionados (imagens, autor, etc)
    ...params
  });
};

/**
 * Buscar uma postagem específica por slug
 */
export const getPostBySlug = async (slug) => {
  try {
    const posts = await fetchFromAPI('/posts', { slug, per_page: 1, _embed: true });
    console.log('getPostBySlug result:', { slug, found: posts.length > 0, title: posts[0]?.title?.rendered });
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
};

/**
 * Buscar postagens por categoria
 */
export const getPostsByCategory = async (categoryId, params = {}) => {
  return fetchFromAPI('/posts', {
    categories: categoryId,
    per_page: 100,
    _embed: true,
    ...params
  });
};

/**
 * Buscar todas as categorias
 */
export const getCategories = async (params = {}) => {
  return fetchFromAPI('/categories', {
    per_page: 100,
    ...params
  });
};

/**
 * Buscar uma categoria específica por slug
 */
export const getCategoryBySlug = async (slug) => {
  const categories = await fetchFromAPI('/categories', { slug, per_page: 1 });
  return categories.length > 0 ? categories[0] : null;
};

/**
 * Buscar mídia (imagens)
 */
export const getMedia = async (params = {}) => {
  return fetchFromAPI('/media', {
    per_page: 100,
    ...params
  });
};

/**
 * Buscar uma mídia específica por ID
 */
export const getMediaById = async (id) => {
  return fetchFromAPI(`/media/${id}`);
};

/**
 * Buscar menus do WordPress (se disponível)
 */
export const getMenus = async () => {
  try {
    // Tentar buscar menus através de endpoint customizado ou usar páginas como fallback
    return await fetchFromAPI('/menu-locations');
  } catch (error) {
    console.warn('Menu endpoint not available, using pages as fallback');
    return null;
  }
};

/**
 * Mapear rotas do React para slugs do WordPress
 */
export const ROUTE_TO_SLUG_MAP = {
  '/': 'home',
  '/kyokushinkaikan': 'kyokushinkaikan',
  '/kickboxing': 'kickboxing',
  '/thai-boxing': 'thai-boxing',
  '/kobudo': 'kobudo',
  '/galeria': 'galeria',
  '/produtos': 'produtos-e-materiais',
  '/noticias': 'noticias',
  '/contatos': 'contatos',
  '/nagata-gym': 'nagata-gym',
  '/historia': 'historia',
  '/mestres': 'mestres',
  '/filosofia': 'filosofia',
};

/**
 * Buscar conteúdo de uma página baseado na rota
 */
export const getPageContentByRoute = async (route) => {
  const slug = ROUTE_TO_SLUG_MAP[route] || route.replace('/', '').replace(/^\//, '');
  
  console.log('getPageContentByRoute called:', { route, slug });
  
  if (!slug) {
    console.warn('No slug found for route:', route);
    return null;
  }

  try {
    // Primeiro tenta buscar como página
    console.log('Trying to fetch as page...');
    let content = await getPageBySlug(slug);
    
    // Se não encontrar, tenta como post
    if (!content) {
      console.log('Not found as page, trying as post...');
      content = await getPostBySlug(slug);
    }
    
    // Se ainda não encontrar, tenta buscar diretamente pelo slug exato
    if (!content) {
      console.log('Not found, trying direct fetch...');
      // Tenta buscar como página primeiro
      const pages = await fetchFromAPI('/pages', { slug, per_page: 1, _embed: true });
      if (pages.length > 0) {
        console.log('Found as page via direct fetch');
        content = pages[0];
      } else {
        // Tenta como post
        const posts = await fetchFromAPI('/posts', { slug, per_page: 1, _embed: true });
        if (posts.length > 0) {
          console.log('Found as post via direct fetch');
          content = posts[0];
        } else {
          console.warn('Content not found for slug:', slug);
        }
      }
    } else {
      console.log('Content found:', { type: content.type, title: content.title?.rendered });
    }
    
    return content;
  } catch (error) {
    console.error('Error in getPageContentByRoute:', error);
    return null;
  }
};

export default {
  getPages,
  getPageBySlug,
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  getCategories,
  getCategoryBySlug,
  getMedia,
  getMediaById,
  getMenus,
  getPageContentByRoute,
  ROUTE_TO_SLUG_MAP,
};

