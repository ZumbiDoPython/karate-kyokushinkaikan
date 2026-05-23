import React, { useMemo } from 'react';
import YoutubeEmbed from './YoutubeEmbed';
import Gallery from './Gallery';
import ImageLightbox from './ImageLightbox';
import ContentValidationNotice from './ContentValidationNotice';
import { validateForRender } from '../utils/contentSchema';

const GALLERY_MIN_IMAGES = 3;

/**
 * @typedef {Object} SidebarMenuItem
 * @property {string} label
 * @property {string} target
 * @property {SidebarMenuItem[]} [children]
 */

/**
 * @param {import('../services/contentApi').ContentPage} page
 * @returns {SidebarMenuItem[]}
 */
export function buildMenuFromPage(page) {
  if (!page?.sections?.length) return [];

  return page.sections
    .filter((section) => section.title && section.id)
    .map((section) => mapSectionToMenuItem(section));
}

/**
 * @param {import('../services/contentApi').ContentSection} section
 */
function mapSectionToMenuItem(section) {
  /** @type {SidebarMenuItem} */
  const item = {
    label: section.title,
    target: section.id,
  };

  if (section.children?.length) {
    item.children = section.children
      .filter((child) => child.title && child.id)
      .map((child) => mapSectionToMenuItem(child));
  }

  return item;
}

/**
 * @param {import('../services/contentApi').ContentSection} section
 */
function collectImageBlocks(section) {
  /** @type {{ src: string, alt: string }[]} */
  const images = [];

  section.blocks.forEach((block) => {
    if (block.type === 'image' && block.payload.src) {
      images.push({ src: block.payload.src, alt: block.payload.alt || '' });
    }
  });

  (section.children || []).forEach((child) => {
    images.push(...collectImageBlocks(child));
  });

  return images;
}

/**
 * @param {import('../services/contentApi').ContentBlock[]} blocks
 */
function shouldUseGallery(blocks, forceGallery) {
  if (forceGallery) return true;
  const imageCount = blocks.filter((b) => b.type === 'image').length;
  return imageCount >= GALLERY_MIN_IMAGES;
}

/**
 * @param {{ block: import('../services/contentApi').ContentBlock }} props
 */
const TextBlock = ({ block }) => (
  <div
    className="content-text mb-4 text-gray-700 leading-relaxed prose prose-lg max-w-none"
    dangerouslySetInnerHTML={{ __html: block.payload.html }}
  />
);

/**
 * @param {{ block: import('../services/contentApi').ContentBlock }} props
 */
const ImageBlock = ({ block }) => (
  <ImageLightbox
    src={block.payload.src}
    alt={block.payload.alt || ''}
    caption={block.payload.caption}
  />
);

/**
 * @param {{ block: import('../services/contentApi').ContentBlock }} props
 */
const YoutubeBlock = ({ block }) => {
  const embedId = block.payload.videoId || block.payload.embedId;
  if (!embedId) return null;
  return <YoutubeEmbed embedId={embedId} />;
};

/**
 * @param {import('../services/contentApi').ContentBlock[]} blocks
 * @param {boolean} forceGallery
 * @param {boolean} hideImages
 */
function BlocksRenderer({ blocks, forceGallery = false, hideImages = false }) {
  if (!blocks?.length) return null;

  const imageBlocks = blocks.filter((b) => b.type === 'image');
  const useGallery = !hideImages && shouldUseGallery(blocks, forceGallery);

  if (useGallery && imageBlocks.length > 0) {
    const galleryImages = imageBlocks.map((b) => ({
      src: b.payload.src,
      alt: b.payload.alt || '',
    }));
    const otherBlocks = blocks.filter((b) => b.type !== 'image');

    return (
      <>
        {otherBlocks.map((block, index) => (
          <BlockSwitch key={`other-${index}`} block={block} />
        ))}
        <Gallery images={galleryImages} />
      </>
    );
  }

  return blocks.map((block, index) => {
    if (hideImages && block.type === 'image') return null;
    return <BlockSwitch key={`block-${index}`} block={block} />;
  });
}

/**
 * @param {{ block: import('../services/contentApi').ContentBlock }} props
 */
function BlockSwitch({ block }) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'youtube':
      return <YoutubeBlock block={block} />;
    default:
      return null;
  }
}

/** Estilos por profundidade: título menor e mais perto do pai a cada nível. */
const SECTION_DEPTH_STYLES = [
  {
    title: 'text-3xl font-bold text-gray-900 leading-tight mb-1',
    subtitle: 'text-lg text-gray-600 leading-snug mb-4 -mt-0.5',
    bodyGap: 'space-y-3',
    childrenWrap: 'mt-2 space-y-2',
  },
  {
    title: 'text-2xl font-semibold text-gray-800 leading-tight mb-0.5 mt-3',
    subtitle: 'text-base text-gray-600 leading-snug mb-3 -mt-0.5',
    bodyGap: 'space-y-2',
    childrenWrap: 'mt-1.5 space-y-1.5',
  },
  {
    title: 'text-xl font-semibold text-gray-800 leading-snug mb-0.5 mt-2.5',
    subtitle: 'text-sm text-gray-600 leading-snug mb-2 -mt-0.5',
    bodyGap: 'space-y-2',
    childrenWrap: 'mt-1 space-y-1',
  },
  {
    title: 'text-lg font-medium text-gray-700 leading-snug mb-0.5 mt-2',
    subtitle: 'text-sm text-gray-500 leading-snug mb-2 -mt-0.5',
    bodyGap: 'space-y-1.5',
    childrenWrap: 'mt-1 space-y-1',
  },
  {
    title: 'text-base font-medium text-gray-700 leading-snug mb-0.5 mt-1.5',
    subtitle: 'text-xs text-gray-500 leading-snug mb-1.5 -mt-0.5',
    bodyGap: 'space-y-1.5',
    childrenWrap: 'mt-1 space-y-1',
  },
];

/**
 * @param {number} depth
 */
function getDepthStyles(depth) {
  return SECTION_DEPTH_STYLES[Math.min(depth, SECTION_DEPTH_STYLES.length - 1)];
}

/**
 * @param {import('../services/contentNormalizer').ContentSection} section
 * @param {number} depth 0 = h2 (seção raiz da página)
 * @param {string[]} gallerySectionIds
 */
const NestedSectionRenderer = ({ section, depth, gallerySectionIds }) => {
  const headingLevel = Math.min(depth + 2, 6);
  const styles = getDepthStyles(depth);

  const forceGallery = gallerySectionIds.some((id) => section.id.includes(id));
  const galleryImages = collectImageBlocks(section);
  const hideImages = forceGallery && galleryImages.length >= GALLERY_MIN_IMAGES;
  const children = section.children || [];

  const inner = (
    <div className={styles.bodyGap}>
      {(section.title || section.subtitle) && (
        <header className="scroll-mt-24">
          {section.title &&
            React.createElement(
              `h${headingLevel}`,
              {
                ...(depth > 0 ? { id: section.id } : {}),
                className: styles.title,
              },
              section.title
            )}
          {section.subtitle && <p className={styles.subtitle}>{section.subtitle}</p>}
        </header>
      )}

      <BlocksRenderer
        blocks={section.blocks}
        forceGallery={forceGallery}
        hideImages={hideImages}
      />
      {depth === 0 && hideImages && galleryImages.length > 0 && (
        <Gallery images={galleryImages} />
      )}

      {children.length > 0 && (
        <div className={styles.childrenWrap}>
          {children.map((child) => (
            <NestedSectionRenderer
              key={child.id}
              section={child}
              depth={depth + 1}
              gallerySectionIds={gallerySectionIds}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (depth === 0) {
    return (
      <section id={section.id} className="scroll-mt-24">
        {inner}
      </section>
    );
  }

  return <div className="scroll-mt-24">{inner}</div>;
};

/**
 * @param {Object} props
 * @param {import('../services/contentApi').ContentPage} props.page
 * @param {string[]} [props.gallerySectionIds]
 * @param {boolean} [props.showPageHeader]
 */
const PageContentRenderer = ({
  page,
  gallerySectionIds = ['galeria'],
  showPageHeader = true,
}) => {
  const validation = useMemo(() => (page ? validateForRender(page) : null), [page]);

  if (!page) return null;

  const displayPage = validation?.sanitizedPage || page;
  const showNotice =
    validation && (validation.errors.length > 0 || validation.warnings.length > 0);

  return (
    <main className="flex-1 p-8 space-y-16 bg-white bg-opacity-90">
      {showNotice && (
        <ContentValidationNotice
          errors={validation.errors}
          warnings={validation.warnings}
          variant="public"
        />
      )}

      {showPageHeader && (displayPage.title || displayPage.subtitle) && (
        <header id="page-header" className="scroll-mt-24 mb-2">
          {displayPage.title && (
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-1">
              {displayPage.title}
            </h1>
          )}
          {displayPage.subtitle && (
            <p className="text-lg text-gray-600 leading-snug -mt-0.5">{displayPage.subtitle}</p>
          )}
        </header>
      )}

      {displayPage.sections.map((section) => (
        <NestedSectionRenderer
          key={section.id}
          section={section}
          depth={0}
          gallerySectionIds={gallerySectionIds}
        />
      ))}
    </main>
  );
};

export default PageContentRenderer;
