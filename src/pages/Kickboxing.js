import React from "react";
import { usePageByRoute } from "../hooks/useWordPress";
import WordPressContent from "../components/WordPressContent";
import PageWithSidebar from '../components/PageWithSidebar';
import ParallaxBackground from '../components/ParallaxBackground';

const Kickboxing = () => {
  const menuItems = [
    { label: "Início", target: "inicio" },
    { label: "História", target: "historia" },
    { label: "Técnicas", target: "tecnicas" },
    { label: "Competições", target: "competicoes" },
    { label: "Galeria", target: "galeria" },
  ];

  const { page, loading } = usePageByRoute('/kickboxing');

  const defaultContent = (
    <main className="flex-1 p-8 space-y-16 bg-white bg-opacity-90">
      <section id="inicio" className="space-y-4">
        <h1 className="text-3xl font-bold mb-4">Kickboxing</h1>
        <p>
          O Kickboxing é uma arte marcial que combina técnicas de boxe com chutes de artes marciais orientais.
          É uma modalidade esportiva que desenvolve condicionamento físico, coordenação motora e disciplina.
        </p>
      </section>

      <section id="historia" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2">História do Kickboxing</h2>
        <p>
          O Kickboxing surgiu no Japão na década de 1960, como uma forma de combate que permitia 
          tanto socos quanto chutes. Desde então, evoluiu para se tornar uma modalidade esportiva 
          reconhecida mundialmente.
        </p>
      </section>

      <section id="tecnicas" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Técnicas</h2>
        <p>
          As técnicas do Kickboxing incluem socos diretos, cruzados, ganchos e uppercuts, 
          combinados com chutes frontais, laterais, circulares e giratórios.
        </p>
      </section>

      <section id="competicoes" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Competições</h2>
        <p>
          O Kickboxing possui diversas organizações e campeonatos ao redor do mundo, 
          incluindo competições amadoras e profissionais.
        </p>
      </section>

      <section id="galeria" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Galeria</h2>
        <p>Confira algumas imagens de treinos e competições de Kickboxing.</p>
      </section>
    </main>
  );

  if (loading) {
    return (
      <PageWithSidebar menuItems={menuItems}>
        <ParallaxBackground imageUrl="https://i.imgur.com/vF5SgMB.png" />
        <div className="flex items-center justify-center min-h-screen bg-white bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando conteúdo...</p>
          </div>
        </div>
      </PageWithSidebar>
    );
  }

  return (
    <PageWithSidebar menuItems={menuItems}>
      <ParallaxBackground imageUrl="https://i.imgur.com/vF5SgMB.png" />
      {page ? (
        <main className="flex-1 p-8 space-y-16 bg-white bg-opacity-90">
          <section id="inicio" className="space-y-4">
            <h1 className="text-3xl font-bold mb-4">{page.title?.rendered || 'Kickboxing'}</h1>
            <WordPressContent content={page.content?.rendered} />
          </section>
        </main>
      ) : (
        defaultContent
      )}
    </PageWithSidebar>
  );
};

export default Kickboxing;
