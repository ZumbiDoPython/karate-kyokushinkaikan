import React, { useMemo } from 'react';
import { useContentPage } from '../hooks/useContentPage';
import PageContentRenderer from '../components/PageContentRenderer';
import Seo from '../components/Seo';
import { buildOrganizationJsonLd, buildWebsiteJsonLd, DEFAULT_OG_IMAGE } from '../config/seo';

const Home = () => {
  const { page, loading, error } = useContentPage('home', { publicOnly: true });
  const seoJsonLd = useMemo(
    () => [buildOrganizationJsonLd(), buildWebsiteJsonLd()],
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading home page:', error);
  }

  const defaultContent = (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Bem-vindo ao Kyokushinkaikan</h1>
      <div className="text-center">
        <p className="text-lg mb-4">Confederação Brasileira de Karate Kyokushinkaikan</p>
        <p className="text-md text-gray-600">
          Abraço a todos os estilos de Karate Full Contact - Kickboxing - Thai Boxing
        </p>
      </div>
    </div>
  );

  if (page?.sections?.some((s) => s.blocks.length > 0 || s.children.length > 0)) {
    return (
      <>
        <Seo
          title={page.title}
          description={page.subtitle || page.title}
          path="/"
          image={page.parallaxImage || DEFAULT_OG_IMAGE}
          jsonLd={seoJsonLd}
        />
        <PageContentRenderer page={page} showPageHeader />
      </>
    );
  }

  if (page?.title) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Seo
          title={page.title}
          description={page.subtitle || page.title}
          path="/"
          image={page.parallaxImage || DEFAULT_OG_IMAGE}
          jsonLd={seoJsonLd}
        />
        <h1 className="text-4xl font-bold text-center mb-8">{page.title}</h1>
        {page.subtitle && <p className="text-center text-gray-600">{page.subtitle}</p>}
      </div>
    );
  }

  return (
    <>
      <Seo path="/" jsonLd={seoJsonLd} />
      {defaultContent}
    </>
  );
};

export default Home;
