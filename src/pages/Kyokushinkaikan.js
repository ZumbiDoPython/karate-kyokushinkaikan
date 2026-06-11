import React from 'react';
import InstitutionalPage from '../components/InstitutionalPage';
import ContentModeBadge from '../components/ContentModeBadge';
import { isContentApiEnabledForSlug } from '../config/featureFlags';
import KyokushinkaikanLegacy from './legacy/KyokushinkaikanLegacy';

const SLUG = 'kyokushinkaikan';

/**
 * Piloto contentApi: com REACT_APP_USE_CONTENT_API=true usa API + PageContentRenderer.
 * Caso contrário, mantém layout hardcoded legado para comparação visual.
 */
const Kyokushinkaikan = () => (
  <>
    {isContentApiEnabledForSlug(SLUG) ? (
      <InstitutionalPage slug={SLUG} />
    ) : (
      <KyokushinkaikanLegacy />
    )}
    <ContentModeBadge slug={SLUG} />
  </>
);

export default Kyokushinkaikan;
