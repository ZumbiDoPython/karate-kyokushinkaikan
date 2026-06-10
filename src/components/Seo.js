import { useEffect, useMemo } from 'react';
import {
  SITE_NAME,
  SITE_LOCALE,
  DEFAULT_SEO,
  buildCanonicalUrl,
  buildPageTitle,
  truncateDescription,
  buildOrganizationJsonLd,
} from '../config/seo';

/**
 * @param {'name'|'property'} kind
 * @param {string} key
 * @param {string} content
 */
function upsertMeta(kind, key, content) {
  if (typeof document === 'undefined' || !content) return;
  const selector =
    kind === 'name'
      ? `meta[name="${key}"]`
      : `meta[property="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (kind === 'name') el.setAttribute('name', key);
    else el.setAttribute('property', key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * @param {string} href
 */
function upsertCanonical(href) {
  if (typeof document === 'undefined' || !href) return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * @param {string} id
 * @param {object|null} data
 */
function upsertJsonLd(id, data) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.path]
 * @param {string} [props.image]
 * @param {string} [props.type]
 * @param {boolean} [props.noIndex]
 * @param {object|object[]|null} [props.jsonLd]
 */
const Seo = ({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noIndex = false,
  jsonLd = null,
}) => {
  const jsonLdKey = useMemo(() => JSON.stringify(jsonLd), [jsonLd]);

  useEffect(() => {
    const pageTitle = buildPageTitle(title || DEFAULT_SEO.title);
    const pageDescription = truncateDescription(description || DEFAULT_SEO.description);
    const canonical = buildCanonicalUrl(path);
    const ogImage = image || DEFAULT_SEO.image;

    document.title = pageTitle;

    upsertMeta('name', 'description', pageDescription);
    upsertMeta(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    );
    upsertCanonical(noIndex ? '' : canonical);

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', SITE_LOCALE);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', ogImage);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', pageDescription);
    upsertMeta('name', 'twitter:image', ogImage);

    const ldItems = jsonLdKey ? JSON.parse(jsonLdKey) : [];
    const ldArray = Array.isArray(ldItems) ? ldItems : ldItems ? [ldItems] : [];

    if (!noIndex && ldArray.length === 0) {
      upsertJsonLd('seo-jsonld-org', buildOrganizationJsonLd());
    } else if (noIndex) {
      upsertJsonLd('seo-jsonld-org', null);
    }

    ldArray.forEach((item, index) => {
      upsertJsonLd(`seo-jsonld-${index}`, item);
    });

    return () => {
      ldArray.forEach((_, index) => upsertJsonLd(`seo-jsonld-${index}`, null));
    };
  }, [title, description, path, image, type, noIndex, jsonLdKey]);

  return null;
};

export default Seo;
