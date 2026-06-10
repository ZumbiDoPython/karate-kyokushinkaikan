import React, { useMemo, useState } from 'react';
import Gallery from './Gallery';
import ImageGalleryModal from './ImageGalleryModal';
import YoutubeEmbed from './YoutubeEmbed';
import { collectArticleImages } from '../services/newsNormalizer';
import { normalizeImageWidthPercent, formatTextBlockHtml } from '../services/contentNormalizer';
import ContentTable from './ContentTable';
import { segmentBlocksForGallery } from '../utils/blockGallerySegments';

/**
 * @param {{ block: import('../services/contentNormalizer').ContentBlock, onImageClick?: (src: string) => void }} props
 */
const ArticleBlockSwitch = ({ block, onImageClick }) => {
  if (block.type === 'text') {
    return (
      <div
        className="content-text text-gray-700 leading-relaxed prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: formatTextBlockHtml(block.payload.html) }}
      />
    );
  }

  if (block.type === 'subtitle' && block.payload?.text) {
    return (
      <p className="text-lg text-gray-600 leading-snug mb-2 -mt-0.5 font-medium">
        {block.payload.text}
      </p>
    );
  }

  if (block.type === 'image' && block.payload?.src) {
    const pct = normalizeImageWidthPercent(block.payload);
    const widthStyle =
      pct >= 100 ? { maxWidth: '100%' } : { width: `${pct}%`, maxWidth: `${pct}%` };
    return (
      <figure className="my-4 text-center">
        <img
          src={block.payload.src}
          alt={block.payload.alt || ''}
          style={widthStyle}
          className="mx-auto h-auto cursor-pointer rounded shadow-md hover:opacity-80 transition"
          onClick={() => onImageClick?.(block.payload.src)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onImageClick?.(block.payload.src);
            }
          }}
        />
        {block.payload.caption && (
          <figcaption className="mt-2 text-sm text-gray-600">{block.payload.caption}</figcaption>
        )}
      </figure>
    );
  }

  if (block.type === 'youtube') {
    const embedId = block.payload?.videoId || block.payload?.embedId;
    if (!embedId) return null;
    return (
      <YoutubeEmbed
        embedId={embedId}
        widthPercent={normalizeImageWidthPercent(block.payload)}
      />
    );
  }

  if (block.type === 'table') {
    return <ContentTable payload={block.payload} />;
  }

  if (block.type === 'link' && block.payload?.href && block.payload?.label) {
    const newTab = block.payload.openInNewTab !== false;
    return (
      <p className="content-text mb-4">
        <a
          href={block.payload.href}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {block.payload.label}
        </a>
      </p>
    );
  }

  return null;
};

/**
 * @param {{ blocks: import('../services/contentNormalizer').ContentBlock[] }} props
 */
const ArticleContentRenderer = ({ blocks }) => {
  const images = useMemo(() => collectArticleImages(blocks), [blocks]);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const segments = useMemo(() => segmentBlocksForGallery(blocks || []), [blocks]);

  const openGallery = (src) => {
    const idx = images.findIndex((img) => img.src === src);
    if (idx >= 0) setGalleryIndex(idx);
  };

  if (!blocks?.length) return null;

  return (
    <>
      <div className="space-y-4">
        {segments.map((segment, index) => {
          if (segment.kind === 'gallery') {
            const galleryImages = segment.blocks.map((b) => ({
              src: b.payload.src,
              alt: b.payload.alt || '',
            }));
            return <Gallery key={`gallery-${index}`} images={galleryImages} />;
          }

          return (
            <ArticleBlockSwitch
              key={segment.block.id || `block-${index}`}
              block={segment.block}
              onImageClick={openGallery}
            />
          );
        })}
      </div>

      {galleryIndex !== null && images.length > 0 && (
        <ImageGalleryModal
          images={images}
          startIndex={galleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </>
  );
};

export default ArticleContentRenderer;
