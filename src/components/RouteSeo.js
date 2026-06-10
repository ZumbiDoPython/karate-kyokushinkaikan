import { useLocation } from 'react-router-dom';
import Seo from './Seo';
import { getRouteSeo } from '../config/seo';

/**
 * SEO padrão por rota (páginas estáticas). Páginas com CMS/notícias sobrescrevem com <Seo /> próprio.
 */
const RouteSeo = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin')) {
    return <Seo title="Admin" noIndex path={pathname} />;
  }

  const config = getRouteSeo(pathname);
  return (
    <Seo
      title={config.title}
      description={config.description}
      path={pathname}
      type={config.type || 'website'}
    />
  );
};

export default RouteSeo;
