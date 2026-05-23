import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'kk_admin_token';
const AdminAuthContext = createContext(null);

const getExpectedToken = () =>
  process.env.REACT_APP_ADMIN_TOKEN || process.env.REACT_APP_ADMIN_PASSWORD || 'admin';

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const expected = getExpectedToken();
    setIsAuthenticated(!!stored && stored === expected);
    setToken(stored);
  }, []);

  const login = useCallback((password) => {
    const expected = getExpectedToken();
    if (password === expected) {
      sessionStorage.setItem(STORAGE_KEY, password);
      setToken(password);
      setIsAuthenticated(true);
      return { ok: true };
    }
    return { ok: false, error: 'Senha inválida' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
};

export default AdminAuthContext;
