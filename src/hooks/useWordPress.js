import { useState, useEffect } from 'react';
import * as wpApi from '../services/wordpressApi';

/**
 * Hook para buscar uma página do WordPress por slug
 */
export const usePage = (slug) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await wpApi.getPageBySlug(slug);
        setPage(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching page:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  return { page, loading, error };
};

/**
 * Hook para buscar postagens do WordPress
 */
export const usePosts = (params = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await wpApi.getPosts(params);
        setPosts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [JSON.stringify(params)]);

  return { posts, loading, error };
};

/**
 * Hook para buscar postagens por categoria
 */
export const usePostsByCategory = (categorySlug, params = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Primeiro buscar a categoria pelo slug
        const category = await wpApi.getCategoryBySlug(categorySlug);
        
        if (category) {
          const data = await wpApi.getPostsByCategory(category.id, params);
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts by category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchPosts();
    }
  }, [categorySlug, JSON.stringify(params)]);

  return { posts, loading, error };
};

/**
 * Hook para buscar conteúdo de uma página baseado na rota
 */
export const usePageByRoute = (route) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching page for route:', route);
        const data = await wpApi.getPageContentByRoute(route);
        console.log('Page data received:', { hasData: !!data, title: data?.title?.rendered, type: data?.type });
        setPage(data);
      } catch (err) {
        console.error('Error fetching page by route:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (route) {
      fetchPage();
    } else {
      setLoading(false);
    }
  }, [route]);

  return { page, loading, error };
};

/**
 * Hook para buscar todas as categorias
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await wpApi.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

/**
 * Hook para buscar mídia (imagens)
 */
export const useMedia = (params = {}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await wpApi.getMedia(params);
        setMedia(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching media:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [JSON.stringify(params)]);

  return { media, loading, error };
};

