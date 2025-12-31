import React from "react";
import { usePageByRoute } from "../hooks/useWordPress";
import WordPressContent from "../components/WordPressContent";

const Home = () => {
  const { page, loading, error } = usePageByRoute('/');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading home page:', error);
  }

  // Fallback content se não houver conteúdo do WordPress
  const defaultContent = (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Bem-vindo ao Kyokushinkaikan</h1>
      <div className="text-center">
        <p className="text-lg mb-4">
          Confederação Brasileira de Karate Kyokushinkaikan
        </p>
        <p className="text-md text-gray-600">
          Abraço a todos os estilos de Karate Full Contact - Kickboxing - Thai Boxing
        </p>
      </div>
    </div>
  );

  if (page) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {page.title?.rendered || 'Bem-vindo ao Kyokushinkaikan'}
        </h1>
        <WordPressContent content={page.content?.rendered} />
      </div>
    );
  }

  return defaultContent;
};

export default Home;
