/**
 * Gera public/sitemap.xml antes do build.
 * Usa REACT_APP_SITE_URL de .env.production quando existir.
 */
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.production') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://kyokushinkaikan-brasil.web.app').replace(
  /\/$/,
  ''
);

const paths = [
  '/',
  '/kyokushinkaikan',
  '/kickboxing',
  '/thai-boxing',
  '/kobudo',
  '/galeria',
  '/produtos',
  '/noticias',
  '/contatos',
  '/nagata-gym',
  '/historia',
  '/mestres',
  '/filosofia',
];

const today = new Date().toISOString().slice(0, 10);

const urls = paths
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p === '/' ? '/' : p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === '/' || p === '/noticias' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === '/' ? '1.0' : p === '/noticias' ? '0.9' : '0.8'}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(out, xml, 'utf8');
console.log('sitemap.xml gerado:', out, '→', SITE_URL);
