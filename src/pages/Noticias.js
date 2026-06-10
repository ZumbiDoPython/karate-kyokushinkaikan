import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listArticles, listTags } from '../services/newsApi';
import { formatArticleDate } from '../services/newsNormalizer';

const Noticias = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const typeFilter = searchParams.get('tipo') || '';
  const tagFilter = searchParams.get('tag') || '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [items, tagList] = await Promise.all([
          listArticles({
            publicOnly: true,
            type: typeFilter === 'news' || typeFilter === 'event' ? typeFilter : undefined,
            tagId: tagFilter || undefined,
          }),
          listTags(),
        ]);
        if (!cancelled) {
          setArticles(items);
          setTags(tagList);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [typeFilter, tagFilter]);

  const tagMap = useMemo(() => {
    const map = {};
    tags.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [tags]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Notícias e Eventos</h1>
        <p className="text-gray-600">Acompanhe as novidades e eventos do Kyokushinkaikan.</p>
      </header>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-6">{error}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: 'tipo', value: '', label: 'Todos' },
          { key: 'tipo', value: 'news', label: 'Notícias' },
          { key: 'tipo', value: 'event', label: 'Eventos' },
        ].map(({ key, value, label }) => (
          <button
            key={label}
            type="button"
            onClick={() => setFilter(key, value)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              typeFilter === value || (!typeFilter && !value)
                ? 'bg-yellow-500 border-yellow-500 text-gray-900 font-medium'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-gray-500 self-center mr-1">Tags:</span>
          <button
            type="button"
            onClick={() => setFilter('tag', '')}
            className={`px-2 py-1 rounded text-xs border ${
              !tagFilter ? 'bg-gray-800 text-white' : 'bg-white border-gray-300'
            }`}
          >
            Todas
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setFilter('tag', tag.id)}
              className={`px-2 py-1 rounded text-xs border ${
                tagFilter === tag.id ? 'bg-gray-800 text-white' : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {articles.length === 0 ? (
        <p className="text-gray-500 italic">Nenhuma matéria publicada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              {article.coverImage ? (
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Sem capa
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      article.type === 'event'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {article.type === 'event' ? 'Evento' : 'Notícia'}
                  </span>
                  {(article.tagIds || []).slice(0, 2).map((id) =>
                    tagMap[id] ? (
                      <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {tagMap[id].name}
                      </span>
                    ) : null
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  <Link to={`/noticias/${article.slug}`} className="text-gray-900 hover:text-blue-600">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500 mb-3">{formatArticleDate(article.publishedAt)}</p>
                {article.excerpt && (
                  <p className="text-gray-700 text-sm line-clamp-3 flex-1">{article.excerpt}</p>
                )}
                <Link
                  to={`/noticias/${article.slug}`}
                  className="text-sm text-blue-600 hover:underline mt-4 inline-block"
                >
                  Ler mais →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Noticias;
