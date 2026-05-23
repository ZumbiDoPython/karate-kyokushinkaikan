import React, { useCallback } from 'react';
import InstitutionalPage from '../components/InstitutionalPage';
import { useSupabaseImages } from '../hooks/useSupabaseImages';

const Galeria = () => {
  const { images: supabaseImages } = useSupabaseImages();

  const transformPage = useCallback(
    (page) => {
      const sections = page.sections.map((s) => ({
        ...s,
        blocks: [...s.blocks],
        children: s.children.map((c) => ({
          ...c,
          blocks: [...c.blocks],
          children: [...c.children],
        })),
      }));

      const imageBlocks = (supabaseImages || []).map((img) => ({
        type: 'image',
        payload: { src: img.src, alt: img.alt || '' },
      }));

      let gallerySection = sections.find((s) => s.id.includes('galeria'));

      if (!gallerySection) {
        gallerySection = {
          id: 'galeria',
          title: 'Galeria de Fotos',
          blocks: [],
          children: [],
        };
        sections.push(gallerySection);
      }

      gallerySection.blocks = [...gallerySection.blocks, ...imageBlocks];

      return { ...page, sections };
    },
    [supabaseImages]
  );

  return (
    <InstitutionalPage
      slug="galeria"
      transformPage={transformPage}
      gallerySectionIds={['galeria']}
    />
  );
};

export default Galeria;
