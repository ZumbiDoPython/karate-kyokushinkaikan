import { useState, useEffect, useCallback } from 'react';
import { getPageBySlug, fetchPageByRoute } from '../services/contentApi';
import { CONTENT_STORE_UPDATED_EVENT } from '../services/contentLocalStore';

/**
 * @param {string} slug
 */
export function useContentPage(slug) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getPageBySlug(slug);
      setPage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar página');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onStoreUpdated = () => load();
    window.addEventListener(CONTENT_STORE_UPDATED_EVENT, onStoreUpdated);
    return () => window.removeEventListener(CONTENT_STORE_UPDATED_EVENT, onStoreUpdated);
  }, [load]);

  return { page, loading, error };
}

/**
 * @param {string} route
 */
export function useContentPageByRoute(route) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!route) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchPageByRoute(route);
        if (!cancelled) setPage(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar página');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [route]);

  return { page, loading, error };
}

export default useContentPage;
