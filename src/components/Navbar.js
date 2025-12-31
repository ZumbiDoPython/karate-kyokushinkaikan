import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMenu } from "../contexts/MenuContext";

const menuOptions = [
  { title: "Início", path: "/" },
  {
    title: "Karate",
    path: "/kyokushinkaikan",
    hasSubmenu: true
  },
  {
    title: "Kickboxing",
    path: "/kickboxing",
    hasSubmenu: true
  },
  { title: "Thai Boxing", path: "/thai-boxing" },
  { title: "Kobudô", path: "/kobudo" },
  { title: "Galeria", path: "/galeria" },
  { title: "Produtos e Materiais", path: "/produtos" },
  { title: "Notícias e Eventos", path: "/noticias" },
  { title: "Contatos", path: "/contatos" },
  { title: "Nagata Gym", path: "/nagata-gym" }
];

// Função para verificar se o path está ativo
const isActivePath = (currentPath, itemPath) => {
  return currentPath === itemPath;
};

// Componente para Navbar no Desktop
const DesktopNavbar = ({ menuOptions }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { getPageMenus } = useMenu();

  // Função para navegar e scrollar
  const handleSubmenuClick = (itemPath, target) => {
    if (currentPath === itemPath) {
      // Já está na página, só scrolla
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navega para a página e adiciona hash
      navigate(`${itemPath}#${target}`);
    }
  };

  return (
    <nav className="bg-yellow-500 text-black p-4 shadow-md hidden md:block">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <ul className="flex space-x-6 text-center">
          {menuOptions.map((item) => {
            const itemMenus = getPageMenus(item.path);
            const shouldShowSubmenu = item.hasSubmenu && !isActivePath(currentPath, item.path) && itemMenus.length > 0;
            
            return (
              <li key={item.title} className="relative group">
                <Link to={item.path} className="hover:text-gray-300 px-3 py-2">
                  {item.title}
                </Link>
                {shouldShowSubmenu && (
                  <ul className="absolute left-0 mt-2 bg-yellow-600 text-black shadow-lg rounded-md hidden group-hover:block z-50">
                    {itemMenus.map((sub) => (
                      <li key={sub.label}>
                        <button 
                          onClick={() => handleSubmenuClick(item.path, sub.target)}
                          className="block w-full text-left px-4 py-2 hover:bg-yellow-700"
                        >
                          {sub.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

// Componente para Navbar no Mobile
const MobileNavbar = ({ menuOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { getPageMenus } = useMenu();

  const toggleSubmenu = (title) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleSubmenuClick = (itemPath, target) => {
    setIsOpen(false);
    if (currentPath === itemPath) {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`${itemPath}#${target}`);
    }
  };

  return (
    <nav className="bg-yellow-500 text-black p-4 shadow-md md:hidden">
      <div className="flex justify-between items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-xl">☰</button>
      </div>
      <ul className={`mt-2 ${isOpen ? "block" : "hidden"}`}>
        {menuOptions.map((item) => {
          const itemMenus = getPageMenus(item.path);
          const shouldShowSubmenu = item.hasSubmenu && !isActivePath(currentPath, item.path) && itemMenus.length > 0;
          
          return (
            <li key={item.title} className="relative">
              {shouldShowSubmenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-600"
                  >
                    {item.title} ▼
                  </button>
                  {openSubmenus[item.title] && (
                    <ul className="bg-yellow-700 text-black rounded-md">
                      {itemMenus.map((sub) => (
                        <li key={sub.label}>
                          <button 
                            onClick={() => handleSubmenuClick(item.path, sub.target)}
                            className="block w-full text-left px-4 py-2 hover:bg-yellow-800"
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={item.path} className="block px-4 py-2 hover:bg-yellow-600">
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// Componente principal que escolhe entre Mobile e Desktop
const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? 
    <MobileNavbar menuOptions={menuOptions} /> : 
    <DesktopNavbar menuOptions={menuOptions} />;
};

export default Navbar;
