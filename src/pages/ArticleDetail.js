import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArticleBySlug, listAuthors, listTags } from '../services/newsApi';
import { formatArticleDate } from '../services/newsNormalizer';
import ArticleContentRenderer from '../components/ArticleContentRenderer';
import ArticleAuthorFooter from '../components/ArticleAuthorFooter';
import Seo from '../components/Seo';
import {
  buildArticleJsonLd,
  buildCanonicalUrl,
  buildOrganizationJsonLd,
  DEFAULT_OG_IMAGE,
} from '../config/seo';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [tagMap, setTagMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [data, authors, tags] = await Promise.all([
          getArticleBySlug(slug, { publicOnly: true }),
          listAuthors(),
          listTags(),
        ]);
        if (cancelled) return;
        if (!data) {
          setError('Matéria não encontrada.');
          return;
        }
        setArticle(data);
        setAuthor(authors.find((a) => a.id === data.authorId) || null);
        const map = {};
        tags.forEach((t) => {
          map[t.id] = t;
        });
        setTagMap(map);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const articlePath = article ? `/noticias/${article.slug}` : '';
  const seoJsonLd = useMemo(() => {
    if (!article) return null;
    return [
      buildOrganizationJsonLd(),
      buildArticleJsonLd(article, buildCanonicalUrl(articlePath), author?.name),
    ];
  }, [article, author, articlePath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">{error || 'Matéria não encontrada.'}</p>
        <Link to="/noticias" className="text-blue-600 hover:underline">
          ← Voltar para notícias
        </Link>
      </div>
    );
  }

  const articleTags = (article.tagIds || [])
    .map((id) => tagMap[id])
    .filter(Boolean);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Seo
        title={article.title}
        description={article.excerpt || article.title}
        path={articlePath}
        image={article.coverImage || DEFAULT_OG_IMAGE}
        type="article"
        jsonLd={seoJsonLd}
      />
      <Link to="/noticias" className="text-sm text-blue-600 hover:underline">
        ← Notícias e eventos
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              article.type === 'event' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {article.type === 'event' ? 'Evento' : 'Notícia'}
          </span>
          {articleTags.map((tag) => (
            <Link
              key={tag.id}
              to={`/noticias?tag=${tag.id}`}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {tag.name}
            </Link>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2">{article.title}</h1>
        <p className="text-gray-500">{formatArticleDate(article.publishedAt)}</p>
        {article.type === 'event' && article.eventDate && (
          <p className="text-sm text-gray-600 mt-2">
            Evento: {formatArticleDate(article.eventDate)}
            {article.eventLocation && ` · ${article.eventLocation}`}
          </p>
        )}
      </header>

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full max-h-[420px] object-cover rounded-lg shadow-md mb-8"
        />
      )}

      {article.excerpt && (
        <p className="text-lg text-gray-700 mb-6 leading-relaxed font-medium">{article.excerpt}</p>
      )}

      <ArticleContentRenderer blocks={article.blocks || []} />

      <ArticleAuthorFooter author={author} />
    </article>
  );
};

export default ArticleDetail;
