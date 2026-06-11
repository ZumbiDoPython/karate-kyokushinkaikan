import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '../firebase/client';
import { isFirestoreStorage } from '../config/contentStorage';

const STORAGE_KEY = 'kk_admin_token';
const AdminAuthContext = createContext(null);

const getExpectedToken = () =>
  process.env.REACT_APP_ADMIN_TOKEN || process.env.REACT_APP_ADMIN_PASSWORD || 'admin';

export const AdminAuthProvider = ({ children }) => {
  const useFirebase = isFirestoreStorage();
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(useFirebase);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!useFirebase) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const expected = getExpectedToken();
      setIsAuthenticated(!!stored && stored === expected);
      setToken(stored);
      setAuthLoading(false);
      return undefined;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setAuthLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUserEmail(user?.email || null);
      setUserId(user?.uid || null);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, [useFirebase]);

  const login = useCallback(
    async (credentials) => {
      if (useFirebase) {
        const email =
          typeof credentials === 'object'
            ? credentials.email
            : process.env.REACT_APP_FIREBASE_ADMIN_EMAIL;
        const password =
          typeof credentials === 'object' ? credentials.password : credentials;

        if (!email || !password) {
          return { ok: false, error: 'E-mail e senha são obrigatórios' };
        }

        try {
          const auth = getFirebaseAuth();
          if (!auth) {
            return { ok: false, error: 'Firebase Auth não configurado' };
          }
          await signInWithEmailAndPassword(auth, email, password);
          return { ok: true };
        } catch (err) {
          const code = err?.code || '';
          if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
            return { ok: false, error: 'E-mail ou senha inválidos' };
          }
          return { ok: false, error: err?.message || 'Falha no login' };
        }
      }

      const password = typeof credentials === 'object' ? credentials.password : credentials;
      const expected = getExpectedToken();
      if (password === expected) {
        sessionStorage.setItem(STORAGE_KEY, password);
        setToken(password);
        setIsAuthenticated(true);
        return { ok: true };
      }
      return { ok: false, error: 'Senha inválida' };
    },
    [useFirebase]
  );

  const logout = useCallback(async () => {
    if (useFirebase) {
      const auth = getFirebaseAuth();
      if (auth) await signOut(auth);
      setUserEmail(null);
      setUserId(null);
      setIsAuthenticated(false);
      return;
    }

    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setIsAuthenticated(false);
  }, [useFirebase]);

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        authLoading,
        token,
        userEmail,
        userId,
        useFirebaseAuth: useFirebase,
        login,
        logout,
      }}
    >
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
