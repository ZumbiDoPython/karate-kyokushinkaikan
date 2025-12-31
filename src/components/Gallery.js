import React, { useState, useEffect, useCallback } from 'react';

const Gallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para abrir o modal com a imagem selecionada
  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  // Função para navegar para a próxima imagem
  const nextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  }, [currentIndex, images]);

  // Função para navegar para a imagem anterior
  const prevImage = useCallback(() => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  }, [currentIndex, images]);

  // Função para navegar com as setas do teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedImage) return;

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'Escape':
          event.preventDefault();
          closeModal();
          break;
        default:
          break;
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, nextImage, prevImage]);

  // Função para navegar clicando nas setas
  const handleArrowClick = (direction) => {
    if (direction === 'next') {
      nextImage();
    } else {
      prevImage();
    }
  };

  // Se não houver imagens, retornar mensagem
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma imagem disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {/* Mosaico de fotos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => openModal(image, index)}
          >
            <img
              src={image.src}
              alt={image.alt || `Imagem ${index + 1}`}
              className="w-full h-48 object-contain bg-gray-100"
            />
          </div>
        ))}
      </div>

      {/* Modal ampliado */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Botão fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>

            {/* Imagem principal */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt || 'Imagem ampliada'}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Seta esquerda */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleArrowClick('prev');
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              ‹
            </button>

            {/* Seta direita */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleArrowClick('next');
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              ›
            </button>

            {/* Indicador de posição */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} de {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 