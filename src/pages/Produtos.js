import React from "react";
import { usePageByRoute } from "../hooks/useWordPress";
import WordPressContent from "../components/WordPressContent";
import ParallaxBackground from "../components/ParallaxBackground";

const Produtos = () => {
  const { page, loading, error } = usePageByRoute('/produtos');

  // Debug: verificar se a página foi carregada
  React.useEffect(() => {
    if (!loading) {
      console.log('Produtos page loaded:', { hasPage: !!page, error, pageTitle: page?.title?.rendered });
    }
  }, [loading, page, error]);

  if (loading) {
    return (
      <ParallaxBackground imageUrl="https://i.imgur.com/vF5SgMB.png">
        <div className="flex items-center justify-center min-h-screen bg-white bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </ParallaxBackground>
    );
  }

  if (error) {
    return (
      <ParallaxBackground imageUrl="https://i.imgur.com/vF5SgMB.png">
        <div className="flex items-center justify-center min-h-screen bg-white bg-opacity-90">
          <div className="text-center text-red-600">
            <p className="mb-4">Erro ao carregar produtos: {error}</p>
          </div>
        </div>
      </ParallaxBackground>
    );
  }

  const defaultContent = (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Produtos e Materiais</h1>
      <p className="text-lg text-gray-600 mb-6">
        Para a compra de materiais entre em contato pelo e-mail:{" "}
        <a href="mailto:nagatajk@gmail.com" className="text-blue-600 hover:underline">
          nagatajk@gmail.com
        </a>
        , ou pelo WhatsApp (15) 981287216 para verificação do material, assim como despesas de envio e transferência bancária (Pix).
      </p>
      <p className="text-lg text-gray-600">
        Em breve, você poderá encontrar aqui todos os produtos e materiais relacionados ao Kyokushinkaikan.
      </p>
    </div>
  );

  // Se houver erro, mostrar mensagem
  if (error && !page) {
    return (
      <ParallaxBackground imageUrl="https://i.imgur.com/vF5SgMB.png">
        <div className="flex items-center justify-center min-h-screen bg-white bg-opacity-90">
          <div className="text-center text-red-600 max-w-2xl mx-auto p-8">
            <p className="mb-4 text-xl font-semibold">Erro ao carregar produtos</p>
            <p className="mb-4">{error}</p>
            <p className="text-sm text-gray-600">Verifique o console do navegador para mais detalhes.</p>
            <div className="mt-8">
              {defaultContent}
            </div>
          </div>
        </div>
      </ParallaxBackground>
    );
  }

  return (
    <ParallaxBackground imageUrl="https://i.imgur.com/vF5SgMB.png">
      <main className="flex-1 p-4 md:p-8 bg-white bg-opacity-90 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          {page && page.content?.rendered ? (
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-gray-900">
                {page.title?.rendered || 'Produtos e Materiais'}
              </h1>
              
              {/* Informações de contato destacadas */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                <p className="text-gray-800 mb-2">
                  <strong>Para compra de materiais:</strong>
                </p>
                <p className="text-gray-700 mb-1">
                  📧 Email: <a href="mailto:nagatajk@gmail.com" className="text-blue-600 hover:underline font-semibold">nagatajk@gmail.com</a>
                </p>
                <p className="text-gray-700">
                  📱 WhatsApp: <a href="https://wa.me/5515981287216" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">(15) 981287216</a>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Verificação do material, despesas de envio e transferência bancária (Pix).
                </p>
              </div>

              {/* Conteúdo do WordPress */}
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                <WordPressContent content={page.content.rendered} />
              </div>
            </div>
          ) : (
            <div>
              {!loading && (
                <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                  <p className="text-yellow-800">
                    ⚠️ Conteúdo não encontrado. Verifique o console do navegador para mais informações.
                  </p>
                </div>
              )}
              {defaultContent}
            </div>
          )}
        </div>
      </main>
    </ParallaxBackground>
  );
};

export default Produtos;
