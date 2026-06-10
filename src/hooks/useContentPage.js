import { useState, useEffect, useCallback } from 'react';
import { getPageBySlug, fetchPageByRoute } from '../services/contentApi';
import { CONTENT_STORE_UPDATED_EVENT } from '../services/contentLocalStore';

/**
 * @param {string} slug
 * @param {{ publicOnly?: boolean }} [options]
 */
export function useContentPage(slug, options = {}) {
  const { publicOnly = false } = options;
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
      const data = await getPageBySlug(slug, { publicOnly });
      setPage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar página');
    } finally {
      setLoading(false);
    }
  }, [slug, publicOnly]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onStoreUpdated = () => load();
    window.addEventListener(CONTENT_STORE_UPDATED_EVENT, onStoreUpdated);
    return () => window.removeEventListener(CONTENT_STORE_UPDATED_EVENT, onStoreUpdated);
  }, [load]);

  return { page, loading, error, reload: load };
}

/**
 * @param {string} route
 * @param {{ publicOnly?: boolean }} [options]
 */
export function useContentPageByRoute(route, options = {}) {
  const { publicOnly = false } = options;
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
        const data = await fetchPageByRoute(route, { publicOnly });
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
  }, [route, publicOnly]);

  return { page, loading, error };
}

export default useContentPage;
