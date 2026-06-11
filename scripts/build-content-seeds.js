/**
 * Gera src/data/contentSeeds/kyokushinkaikan.json a partir do layout legado.
 * Uso: node scripts/build-content-seeds.js
 */
const fs = require('fs');
const path = require('path');

const legacyPath = path.join(__dirname, '../src/pages/legacy/KyokushinkaikanLegacy.js');
const outDir = path.join(__dirname, '../src/data/contentSeeds');
const outFile = path.join(outDir, 'kyokushinkaikan.json');

const legacy = fs.readFileSync(legacyPath, 'utf8');

function slugify(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'secao';
}

function stripTags(html) {
  return (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseInlineBlocks(html) {
  const blocks = [];
  const re = /(<p[^>]*>[\s\S]*?<\/p>)|(<img[^>]*\/?>)|(<YoutubeEmbed[^>]*\/>)/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[1]) {
      blocks.push({ type: 'text', payload: { html: m[1].trim() } });
    } else if (m[2]) {
      const src = (m[2].match(/src=["']([^"']+)["']/) || [])[1] || '';
      const alt = (m[2].match(/alt=["']([^"']*)["']/) || [])[1] || '';
      if (src) blocks.push({ type: 'image', payload: { src, alt } });
    } else if (m[3]) {
      const embedId = (m[3].match(/embedId=["']([^"']+)["']/) || [])[1] || '';
      if (embedId) {
        blocks.push({
          type: 'youtube',
          payload: { videoId: embedId, embedId },
        });
      }
    }
  }
  return blocks;
}

function splitByHeading(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const matches = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    matches.push({ index: m.index, end: m.index + m[0].length, title: stripTags(m[1]) });
  }
  if (!matches.length) {
    return [{ title: '', body: html }];
  }

  const parts = [];
  if (matches[0].index > 0) {
    parts.push({ title: '', body: html.slice(0, matches[0].index) });
  }
  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].end;
    const end = i + 1 < matches.length ? matches[i + 1].index : html.length;
    parts.push({ title: matches[i].title, body: html.slice(start, end) });
  }
  return parts;
}

function parseSectionWithH3Children(html, baseId) {
  const h3Parts = splitByHeading(html, 'h3');
  const directBlocks = parseInlineBlocks(h3Parts[0].body);

  const children = h3Parts
    .slice(1)
    .filter((p) => p.title)
    .map((p, i) => ({
      id: `${baseId}-${slugify(p.title)}-${i}`,
      title: p.title,
      blocks: parseInlineBlocks(p.body),
      children: [],
    }));

  return { blocks: directBlocks, children };
}

function parseH2Subsections(html, parentId) {
  const h2Parts = splitByHeading(html, 'h2');
  if (h2Parts.length <= 1 && !h2Parts[0].title) {
    const parsed = parseSectionWithH3Children(html, parentId);
    return {
      blocks: parsed.blocks,
      children: parsed.children,
    };
  }

  return {
    blocks: parseInlineBlocks(h2Parts[0].body),
    children: h2Parts
      .filter((p) => p.title)
      .map((p, i) => {
        const id = `${parentId}-${slugify(p.title)}-${i}`;
        const parsed = parseSectionWithH3Children(p.body, id);
        return {
          id,
          title: p.title,
          blocks: parsed.blocks,
          children: parsed.children,
        };
      }),
  };
}

function extractSection(id) {
  const re = new RegExp(`<section id="${id}"[\\s\\S]*?</section>`, 'i');
  const match = legacy.match(re);
  return match ? match[0] : '';
}

function extractGaleriaImages() {
  const m = legacy.match(/const galeriaImagens = (\[[\s\S]*?\]);/);
  if (!m) return [];
  try {
    // eslint-disable-next-line no-eval
    return eval(m[1]);
  } catch {
    return [];
  }
}

const inicioHtml = extractSection('inicio');
const historiaHtml = extractSection('historia');
const fundadoresHtml = extractSection('fundadores');
const galeriaHtml = extractSection('galeria');

const pageTitle =
  stripTags((inicioHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]) || 'Karate Kyokushinkaikan';

const inicioIntro = (inicioHtml.match(/<p[^>]*>[\s\S]*?<\/p>/i) || [])[0] || '';
const historiaTitle =
  stripTags((historiaHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]) ||
  'História do Kyokushinkaikan';
const historiaBody = historiaHtml.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');

const fundadoresInner = fundadoresHtml.replace(/<section[^>]*>/i, '').replace(/<\/section>$/i, '');
const fundadoresParsed = parseH2Subsections(fundadoresInner, 'fundadores');

const galeriaImages = extractGaleriaImages();

const page = {
  id: 'seed-kyokushinkaikan',
  slug: 'kyokushinkaikan',
  title: pageTitle,
  subtitle:
    'Para você saber o que é o Karate Kyokushinkaikan, primeiramente você deve conhecer o Mentor deste estilo o Sosai Masutatsu Oyama.',
  parallaxImage: 'https://i.imgur.com/vF5SgMB.png',
  status: 'published',
  position: 0,
  sections: [
    {
      id: 'inicio',
      title: 'Início',
      position: 0,
      blocks: inicioIntro ? [{ type: 'text', payload: { html: inicioIntro } }] : [],
      children: [],
    },
    {
      id: 'historia',
      title: historiaTitle,
      position: 1,
      blocks: parseInlineBlocks(historiaBody),
      children: [],
    },
    {
      id: 'fundadores',
      title: 'Fundadores',
      position: 2,
      blocks: fundadoresParsed.blocks,
      children: fundadoresParsed.children,
    },
    {
      id: 'galeria',
      title: 'Galeria de Fotos',
      position: 3,
      blocks: [
        {
          type: 'text',
          payload: {
            html: '<p>Confira algumas imagens representando a trajetória e prática do Kyokushinkaikan.</p>',
          },
        },
        ...galeriaImages.map((img) => ({
          type: 'image',
          payload: { src: img.src, alt: img.alt || '' },
        })),
      ],
      children: [],
    },
  ],
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(page, null, 2), 'utf8');

const blockCount = page.sections.reduce((n, s) => {
  const countBlocks = (sec) =>
    sec.blocks.length + sec.children.reduce((c, ch) => c + countBlocks(ch), 0);
  return n + countBlocks(s);
}, 0);

console.log('Seed gerado:', outFile);
console.log('Seções:', page.sections.length, '| Blocos (aprox.):', blockCount);
