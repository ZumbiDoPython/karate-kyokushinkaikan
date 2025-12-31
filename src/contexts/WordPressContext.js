import React, { createContext, useContext, useState, useEffect } from 'react';
import * as wpApi from '../services/wordpressApi';

const WordPressContext = createContext();

export const useWordPress = () => {
  const context = useContext(WordPressContext);
  if (!context) {
    throw new Error('useWordPress must be used within a WordPressProvider');
  }
  return context;
};

export const WordPressProvider = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cache para páginas individuais
  const [pageCache, setPageCache] = useState({});
  const [postCache, setPostCache] = useState({});

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carregar páginas, posts e categorias em paralelo
        const [pagesData, postsData, categoriesData] = await Promise.all([
          wpApi.getPages(),
          wpApi.getPosts({ per_page: 50 }),
          wpApi.getCategories(),
        ]);

        setPages(pagesData);
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading WordPress data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Função para buscar uma página por slug (com cache)
  const getPageBySlug = async (slug) => {
    if (pageCache[slug]) {
      return pageCache[slug];
    }

    try {
      const page = await wpApi.getPageBySlug(slug);
      if (page) {
        setPageCache((prev) => ({ ...prev, [slug]: page }));
      }
      return page;
    } catch (err) {
      console.error('Error fetching page:', err);
      return null;
    }
  };

  // Função para buscar um post por slug (com cache)
  const getPostBySlug = async (slug) => {
    if (postCache[slug]) {
      return postCache[slug];
    }

    try {
      const post = await wpApi.getPostBySlug(slug);
      if (post) {
        setPostCache((prev) => ({ ...prev, [slug]: post }));
      }
      return post;
    } catch (err) {
      console.error('Error fetching post:', err);
      return null;
    }
  };

  // Função para buscar conteúdo por rota
  const getContentByRoute = async (route) => {
    try {
      return await wpApi.getPageContentByRoute(route);
    } catch (err) {
      console.error('Error fetching content by route:', err);
      return null;
    }
  };

  const value = {
    pages,
    posts,
    categories,
    loading,
    error,
    getPageBySlug,
    getPostBySlug,
    getContentByRoute,
    pageCache,
    postCache,
  };

  return (
    <WordPressContext.Provider value={value}>
      {children}
    </WordPressContext.Provider>
  );
};

