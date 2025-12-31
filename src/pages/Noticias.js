import React from "react";
import { usePageByRoute } from "../hooks/useWordPress";
import { usePosts } from "../hooks/useWordPress";
import WordPressContent from "../components/WordPressContent";

const Noticias = () => {
  const { page, loading: pageLoading } = usePageByRoute('/noticias');
  const { posts, loading: postsLoading } = usePosts({ per_page: 10 });

  const loading = pageLoading || postsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {page && (
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{page.title?.rendered || 'Notícias'}</h1>
          <WordPressContent content={page.content?.rendered} />
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6">Últimas Notícias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {post.featured_media && (
                <img
                  src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || post.featured_media_url || ''}
                  alt={post.title?.rendered}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  <a href={`/noticias/${post.slug}`} className="text-blue-600 hover:underline">
                    {post.title?.rendered}
                  </a>
                </h3>
                <div className="text-sm text-gray-500 mb-3">
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </div>
                <div
                  className="text-gray-700 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Noticias;
