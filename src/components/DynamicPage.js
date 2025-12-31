import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePageByRoute } from '../hooks/useWordPress';
import WordPressContent from './WordPressContent';
import PageWithSidebar from './PageWithSidebar';
import ParallaxBackground from './ParallaxBackground';

/**
 * Componente genérico para renderizar páginas dinâmicas do WordPress
 */
const DynamicPage = ({ 
  menuItems = [], 
  parallaxImage = "https://i.imgur.com/vF5SgMB.png",
  defaultContent = null 
}) => {
  const location = useLocation();
  const { page, loading, error } = usePageByRoute(location.pathname);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="mb-4">Erro ao carregar conteúdo: {error}</p>
          {defaultContent && <div>{defaultContent}</div>}
        </div>
      </div>
    );
  }

  if (!page && !defaultContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-500">
          <p>Conteúdo não encontrado</p>
        </div>
      </div>
    );
  }

  // Se tiver menuItems, usar PageWithSidebar, senão renderizar direto
  const content = (
    <ParallaxBackground imageUrl={parallaxImage}>
      <main className="flex-1 p-8 space-y-16 bg-white bg-opacity-90">
        {page ? (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold mb-4">{page.title?.rendered || 'Sem título'}</h1>
            <WordPressContent content={page.content?.rendered} />
          </div>
        ) : (
          defaultContent
        )}
      </main>
    </ParallaxBackground>
  );

  if (menuItems.length > 0) {
    return <PageWithSidebar menuItems={menuItems}>{content}</PageWithSidebar>;
  }

  return content;
};

export default DynamicPage;

