import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Kyokushinkaikan from './pages/Kyokushinkaikan';
import Produtos from './pages/Produtos';
import Noticias from './pages/Noticias';
import ArticleDetail from './pages/ArticleDetail';
import Contatos from './pages/Contatos';
import Kickboxing from './pages/Kickboxing';
import ThaiBoxing from './pages/ThaiBoxing';
import NagataGym from './pages/NagataGym';
import Historia from './pages/Historia';
import Mestres from './pages/Mestres';
import Filosofia from './pages/Filosofia';
import Galeria from './pages/Galeria';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import ContentList from './pages/admin/ContentList';
import ContentEditor from './pages/admin/ContentEditor';
import AdminUsers from './pages/admin/AdminUsers';
import ArticlesList from './pages/admin/ArticlesList';
import ArticleEditor from './pages/admin/ArticleEditor';
import AuthorsAdmin from './pages/admin/AuthorsAdmin';
import TagsAdmin from './pages/admin/TagsAdmin';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Site público */}
      <Route path="/" element={<Home />} />
      <Route path="/kyokushinkaikan" element={<Kyokushinkaikan />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/noticias" element={<Noticias />} />
      <Route path="/noticias/:slug" element={<ArticleDetail />} />
      <Route path="/contatos" element={<Contatos />} />
      <Route path="/kickboxing" element={<Kickboxing />} />
      <Route path="/thai-boxing" element={<ThaiBoxing />} />
      <Route path="/nagata-gym" element={<NagataGym />} />
      <Route path="/kobudo" element={<div><h1>Página Kobudô</h1></div>} />
      <Route path="/galeria" element={<Galeria />} />
      <Route path="/historia" element={<Historia />} />
      <Route path="/mestres" element={<Mestres />} />
      <Route path="/filosofia" element={<Filosofia />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/conteudo" replace />} />
        <Route path="conteudo" element={<ContentList />} />
        <Route path="conteudo/nova" element={<ContentEditor />} />
        <Route path="conteudo/:slug" element={<ContentEditor />} />
        <Route path="usuarios" element={<AdminUsers />} />
        <Route path="materias" element={<ArticlesList />} />
        <Route path="materias/nova" element={<ArticleEditor />} />
        <Route path="materias/:slug" element={<ArticleEditor />} />
        <Route path="autores" element={<AuthorsAdmin />} />
        <Route path="tags" element={<TagsAdmin />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
