import React, { useMemo } from 'react';
import { useContentPage } from '../hooks/useContentPage';
import PageWithSidebar from './PageWithSidebar';
import ParallaxBackground from './ParallaxBackground';
import PageContentRenderer, { buildMenuFromPage } from './PageContentRenderer';
import Seo from './Seo';
import { slugToPublicPath, buildWebsiteJsonLd, buildOrganizationJsonLd, DEFAULT_OG_IMAGE } from '../config/seo';

const DEFAULT_PARALLAX = 'https://i.imgur.com/vF5SgMB.png';

/**
 * @param {Object} props
 * @param {string} props.slug
 * @param {string} [props.parallaxImage]
 * @param {(page: import('../services/contentApi').ContentPage) => import('../services/contentApi').ContentPage} [props.transformPage]
 * @param {boolean} [props.withSidebar]
 * @param {string[]} [props.gallerySectionIds]
 * @param {boolean} [props.showPageHeader]
 */
const InstitutionalPage = ({
  slug,
  parallaxImage,
  transformPage,
  withSidebar = true,
  gallerySectionIds = ['galeria'],
  showPageHeader = true,
}) => {
  const { page: rawPage, loading, error } = useContentPage(slug, { publicOnly: true });

  const page = useMemo(() => {
    if (!rawPage) return null;
    return transformPage ? transformPage(rawPage) : rawPage;
  }, [rawPage, transformPage]);

  const menuItems = useMemo(() => (page ? buildMenuFromPage(page) : []), [page]);
  const publicPath = slugToPublicPath(slug);
  const seoJsonLd = useMemo(
    () =>
      slug === 'home'
        ? [buildOrganizationJsonLd(), buildWebsiteJsonLd()]
        : null,
    [slug]
  );

  if (loading) {
    return (
      <PageShell withSidebar={withSidebar} menuItems={menuItems}>
        <ParallaxBackground imageUrl={parallaxImage || DEFAULT_PARALLAX} />
        <div className="flex items-center justify-center min-h-screen bg-white bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">Carregando conteúdo...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell withSidebar={withSidebar} menuItems={menuItems}>
        <ParallaxBackground imageUrl={parallaxImage || DEFAULT_PARALLAX} />
        <main className="flex-1 p-8 bg-white bg-opacity-90">
          <p className="text-red-600">Erro ao carregar conteúdo: {error}</p>
        </main>
      </PageShell>
    );
  }

  if (!page) {
    return (
      <PageShell withSidebar={withSidebar} menuItems={menuItems}>
        <ParallaxBackground imageUrl={parallaxImage || DEFAULT_PARALLAX} />
        <main className="flex-1 p-8 bg-white bg-opacity-90">
          <p className="text-gray-500">Conteúdo não encontrado.</p>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell withSidebar={withSidebar} menuItems={menuItems}>
      <Seo
        title={page.title}
        description={page.subtitle || page.title}
        path={publicPath}
        image={page.parallaxImage || DEFAULT_OG_IMAGE}
        jsonLd={seoJsonLd}
      />
      <ParallaxBackground imageUrl={parallaxImage || page.parallaxImage || DEFAULT_PARALLAX} />
      <PageContentRenderer
        page={page}
        gallerySectionIds={gallerySectionIds}
        showPageHeader={showPageHeader}
      />
    </PageShell>
  );
};

const PageShell = ({ withSidebar, menuItems, children }) => {
  if (withSidebar && menuItems.length > 0) {
    return <PageWithSidebar menuItems={menuItems}>{children}</PageWithSidebar>;
  }
  return <div className="flex flex-col">{children}</div>;
};

export default InstitutionalPage;
