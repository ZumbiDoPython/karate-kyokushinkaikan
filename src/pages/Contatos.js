import React from "react";
import DynamicPage from "../components/DynamicPage";

const Contatos = () => {
  return (
    <DynamicPage
      defaultContent={
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Contatos</h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Entre em contato conosco através dos canais abaixo:
            </p>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Email</h2>
                <p className="text-blue-600">nagatajk@gmail.com</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Confederação Brasileira de Kyokushinkaikan Karate</h2>
                <p className="text-gray-700">
                  Para mais informações sobre eventos, cursos e treinamentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Contatos;
