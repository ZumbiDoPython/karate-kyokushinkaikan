import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLogin = () => {
  const { isAuthenticated, authLoading, useFirebaseAuth, login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/conteudo';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Verificando sessão...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const result = useFirebaseAuth
      ? await login({ email, password })
      : await login(password);

    setSubmitting(false);

    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Falha no login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">Admin — Login</h1>
        {useFirebaseAuth ? (
          <p className="text-sm text-gray-600">
            Entre com o usuário criado no Firebase Authentication (e-mail/senha).
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Use a senha configurada em{' '}
            <code className="text-xs bg-gray-100 px-1">REACT_APP_ADMIN_TOKEN</code>.
          </p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {useFirebaseAuth && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              autoComplete="username"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded disabled:opacity-50"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
