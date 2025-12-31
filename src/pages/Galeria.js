import React, { useMemo } from 'react';
import { usePageByRoute } from '../hooks/useWordPress';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import WordPressContent from '../components/WordPressContent';
import Gallery from '../components/Gallery';
import PageWithSidebar from '../components/PageWithSidebar';

const Galeria = () => {
  const { page, loading: pageLoading } = usePageByRoute('/galeria');
  const { images: supabaseImages, loading: supabaseLoading } = useSupabaseImages();

  const menuItems = [
    { label: "Inicio", target: "inicio" },
    { label: "Galeria", target: "galeria" },
    { label: "Vídeos", target: "videos" },
  ];

  // Usar imagens do Supabase, com fallback para imagens estáticas
  const galleryImages = useMemo(() => {
    if (supabaseImages && supabaseImages.length > 0) {
      return supabaseImages;
    }
    
    // Fallback: imagens estáticas (apenas se não houver imagens do Supabase)
    return [
      { src: "https://i.imgur.com/4JqAODo.jpg", alt: "Sosai Masutatsu Oyama" },
      { src: "https://i.imgur.com/trpesGt.jpg", alt: "História Kyokushinkaikan" },
      { src: "https://i.imgur.com/70XTKOp.jpg", alt: "Treinamento" },
      { src: "https://i.imgur.com/7bzqy2n.jpg", alt: "Filosofia" },
      { src: "https://i.imgur.com/dMKYy7Q.jpg", alt: "Meditação" },
      { src: "https://i.imgur.com/SNZ5ZN0.jpg", alt: "Demonstração" },
      { src: "https://i.imgur.com/vCFTJu4.jpg", alt: "Combate" },
      { src: "https://i.imgur.com/7q6Ntya.jpeg", alt: "Alunos" },
      { src: "https://i.imgur.com/Pct6Fz2.jpeg", alt: "Livros" },
      { src: "https://i.imgur.com/OcLndhu.png", alt: "Organização" },
    ];
  }, [supabaseImages]);

  const loading = pageLoading || supabaseLoading;

  if (loading) {
    return (
      <PageWithSidebar menuItems={menuItems}>
        <div className="flex items-center justify-center min-h-screen bg-white bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando galeria...</p>
          </div>
        </div>
      </PageWithSidebar>
    );
  }

  return (
    <PageWithSidebar menuItems={menuItems}>
      <main className="flex-1 p-8 space-y-16 bg-white bg-opacity-90">
        {/* Seção: Início */}
        <section id="inicio" className="space-y-4">
          {page ? (
            <>
              <h1 className="text-3xl font-bold mb-4">{page.title?.rendered || 'Galeria de Fotos'}</h1>
              <WordPressContent content={page.content?.rendered} />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4">Galeria de Fotos</h1>
              <p>
                Explore nossa galeria de fotos que documenta a rica história e tradição do Kyokushinkaikan.
                Clique em qualquer imagem para ampliá-la e navegar entre as fotos usando as setas do teclado ou clicando nas setas na tela.
              </p>
            </>
          )}
        </section>

        {/* Seção: Galeria */}
        <section id="galeria" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Fotos do Kyokushinkaikan</h2>
          <Gallery images={galleryImages} />
        </section>

        {/* Seção: Vídeos */}
        <section id="videos" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Vídeos</h2>
          <p>
            Além das fotos, também temos uma coleção de vídeos documentando a história e as técnicas do Kyokushinkaikan.
            Estes vídeos mostram demonstrações, competições e treinamentos.
          </p>
        </section>
      </main>
    </PageWithSidebar>
  );
};

export default Galeria; 