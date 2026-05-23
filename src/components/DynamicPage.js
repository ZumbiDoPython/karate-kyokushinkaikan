import React from 'react';
import { useLocation } from 'react-router-dom';
import { useContentPageByRoute } from '../hooks/useContentPage';
import PageContentRenderer from './PageContentRenderer';
import PageWithSidebar from './PageWithSidebar';
import ParallaxBackground from './ParallaxBackground';
import { buildMenuFromPage } from './PageContentRenderer';

const DEFAULT_PARALLAX = 'https://i.imgur.com/vF5SgMB.png';

/**
 * Página dinâmica baseada no contrato contentApi (por rota).
 */
const DynamicPage = ({
  menuItems: menuOverride,
  parallaxImage = DEFAULT_PARALLAX,
  withSidebar = true,
}) => {
  const location = useLocation();
  const { page, loading, error } = useContentPageByRoute(location.pathname);

  const menuItems = menuOverride?.length
    ? menuOverride
    : page
      ? buildMenuFromPage(page)
      : [];

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
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <p className="text-red-600">Erro ao carregar conteúdo: {error}</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <p className="text-gray-500">Conteúdo não encontrado</p>
      </div>
    );
  }

  const content = (
    <>
      <ParallaxBackground imageUrl={parallaxImage || page.parallaxImage || DEFAULT_PARALLAX} />
      <PageContentRenderer page={page} />
    </>
  );

  if (withSidebar && menuItems.length > 0) {
    return <PageWithSidebar menuItems={menuItems}>{content}</PageWithSidebar>;
  }

  return content;
};

export default DynamicPage;
