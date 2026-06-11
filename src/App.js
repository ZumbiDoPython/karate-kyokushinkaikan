import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Footer from './components/Footer';
import RouteSeo from './components/RouteSeo';
import AppRoutes from './routes';
import { MenuProvider } from './contexts/MenuContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

const PublicShell = ({ children }) => (
  <MenuProvider>
    <RouteSeo />
    <div className="flex flex-col min-h-screen">
      <Banner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  </MenuProvider>
);

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <AdminAuthProvider>
        <RouteSeo />
        <AppRoutes />
      </AdminAuthProvider>
    );
  }

  return (
    <PublicShell>
      <AppRoutes />
    </PublicShell>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
