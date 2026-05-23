import React, { useState, useEffect } from 'react';

/**
 * Imagem clicável que abre em modal (sem redirecionar para URL externa).
 */
const ImageLightbox = ({ src, alt = '', caption, className = '' }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!src) return null;

  return (
    <>
      <figure className="my-4 text-center">
        <img
          src={src}
          alt={alt}
          className={`mx-auto cursor-pointer max-w-full rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105 ${className}`.trim()}
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        {caption && <figcaption className="mt-2 text-sm text-gray-600">{caption}</figcaption>}
      </figure>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'Imagem ampliada'}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Fechar"
          >
            ×
          </button>
          <img
            src={src}
            alt={alt || 'Imagem ampliada'}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ImageLightbox;
