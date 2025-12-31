import { useState, useEffect } from 'react';
import { getImagesFromSupabase } from '../services/supabase';

/**
 * Hook para buscar imagens do Supabase
 */
export const useSupabaseImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getImagesFromSupabase();
        
        // Se não houver dados, retorna array vazio (não é erro)
        if (!data || !Array.isArray(data)) {
          setImages([]);
          setLoading(false);
          return;
        }
        
        // Converter dados do Supabase para formato do componente Gallery
        // Tenta diferentes nomes de colunas comuns para o link da imagem
        const formattedImages = data
          .map((item) => {
            // Tenta encontrar o link da imagem em diferentes campos possíveis
            const imageUrl = item.link || item.url || item.src || item.imagem || item.image_url || item.link_direto || item.direct_link;
            
            if (!imageUrl) {
              console.warn('Imagem sem URL encontrada:', item);
              return null;
            }
            
            return {
              src: imageUrl,
              alt: item.alt || item.title || item.nome || `Imagem ${item.id}`,
            };
          })
          .filter(Boolean); // Remove itens nulos
        
        setImages(formattedImages);
      } catch (err) {
        console.error('Error fetching images from Supabase:', err);
        // Não definir erro como fatal, apenas logar e usar array vazio
        setError(err.message);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, loading, error };
};

