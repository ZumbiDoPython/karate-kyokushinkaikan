import React from "react";
import DynamicPage from "../components/DynamicPage";

const ThaiBoxing = () => {
  return (
    <DynamicPage
      defaultContent={
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Thai Boxing (Muay Thai)</h1>
          <p className="text-lg text-gray-600">
            Conteúdo sobre Thai Boxing será carregado do WordPress.
          </p>
        </div>
      }
    />
  );
};

export default ThaiBoxing;
