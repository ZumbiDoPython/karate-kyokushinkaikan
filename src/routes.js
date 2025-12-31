import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Kyokushinkaikan from "./pages/Kyokushinkaikan";
import Produtos from "./pages/Produtos";
import Noticias from "./pages/Noticias";
import Contatos from "./pages/Contatos";
import Kickboxing from "./pages/Kickboxing";
import ThaiBoxing from "./pages/ThaiBoxing";
import NagataGym from "./pages/NagataGym";
import Historia from "./pages/Historia";
import Mestres from "./pages/Mestres";
import Filosofia from "./pages/Filosofia";
import Galeria from "./pages/Galeria";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kyokushinkaikan" element={<Kyokushinkaikan />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/noticias" element={<Noticias />} />
      <Route path="/contatos" element={<Contatos />} />
      <Route path="/kickboxing" element={<Kickboxing />} />
      <Route path="/thai-boxing" element={<ThaiBoxing />} />
      <Route path="/nagata-gym" element={<NagataGym />} />
      <Route path="/kobudo" element={<div><h1>Página Kobudô</h1></div>} />
      <Route path="/galeria" element={<Galeria />} />
      {/* Submenus */}
      <Route path="/historia" element={<Historia />} />
      <Route path="/mestres" element={<Mestres />} />
      <Route path="/filosofia" element={<Filosofia />} />
    </Routes>
  );
};

export default AppRoutes;
