import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [pageMenus, setPageMenus] = useState({});

  // Pré-registrar menus das páginas conhecidas
  useEffect(() => {
    const initialMenus = {
      '/kyokushinkaikan': [
        { label: "Inicio", target: "inicio" },
        { label: "História", target: "historia" },
        { label: "Filosofia", target: "filosofia" },
        { label: "Fundadores", target: "fundadores" },
        { label: "Galeria", target: "galeria" },
      ],
      '/kickboxing': [
        { label: "Início", target: "inicio" },
        { label: "História", target: "historia" },
        { label: "Técnicas", target: "tecnicas" },
        { label: "Competições", target: "competicoes" },
        { label: "Galeria", target: "galeria" },
      ],
      '/galeria': [
        { label: "Inicio", target: "inicio" },
        { label: "Galeria", target: "galeria" },
        { label: "Vídeos", target: "videos" },
      ]
    };
    setPageMenus(initialMenus);
  }, []);

  const registerPageMenus = (pagePath, menus) => {
    setPageMenus(prev => ({
      ...prev,
      [pagePath]: menus
    }));
  };

  const getPageMenus = (pagePath) => {
    return pageMenus[pagePath] || [];
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const value = {
    pageMenus,
    registerPageMenus,
    getPageMenus,
    scrollToSection
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}; 