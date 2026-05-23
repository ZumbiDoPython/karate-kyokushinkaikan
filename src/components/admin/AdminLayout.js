import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin/conteudo" className="font-bold text-lg hover:text-yellow-400">
              Admin — Conteúdo
            </Link>
            <Link to="/admin/conteudo" className="text-sm text-gray-300 hover:text-white">
              Páginas
            </Link>
            <Link to="/" className="text-sm text-gray-300 hover:text-white" target="_blank" rel="noreferrer">
              Ver site
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded border border-gray-600 hover:bg-gray-800"
          >
            Sair
          </button>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
