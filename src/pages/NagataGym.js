import React from "react";
import DynamicPage from "../components/DynamicPage";

const NagataGym = () => {
  return (
    <DynamicPage
      defaultContent={
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Nagata Gym</h1>
          <p className="text-lg text-gray-600">
            Conteúdo sobre Nagata Gym será carregado do WordPress.
          </p>
        </div>
      }
    />
  );
};

export default NagataGym;
