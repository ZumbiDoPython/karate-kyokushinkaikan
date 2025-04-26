import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const menuOptions = [
  { title: "Início", path: "/" },
  {
    title: "Karate",
    path: "/Kyokushinkaikan",
    submenu: [
      { title: "História", path: "/Historia" },
      { title: "Mestres", path: "/Mestres" },
      { title: "Filosofia", path: "/Filosofia" },
      { title: "Material Técnico", path: "/Material-Tecnico" }
    ]
  },
  { title: "Kickboxing", path: "/Kickboxing" },
  { title: "Thai Boxing", path: "/Thai-boxing" },
  { title: "Kobudô", path: "/Kobudo" },

  { title: "Produtos e Materiais", path: "/Produtos",
    submenu: [
      { title: "História", path: "/Historia" },
      { title: "Mestres", path: "/Mestres" },
      { title: "Filosofia", path: "/Filosofia" }
    ] },
  { title: "Notícias e Eventos", path: "/Noticias" },
  { title: "Contatos", path: "/Contatos" },
  { title: "Nagata Gym", path: "/Nagata-gym" }
];

// Componente para Navbar no Desktop
const DesktopNavbar = ({ menuOptions }) => (
  <nav className="bg-yellow-500 text-black p-4 shadow-md hidden md:block">
    <div className="max-w-7xl mx-auto flex justify-center items-center">
      <ul className="flex space-x-6 text-center">
        {menuOptions.map((item) => (
          <li key={item.title} className="relative group">
            <Link to={item.path} className="hover:text-gray-300 px-3 py-2">
              {item.title}
            </Link>
            {item.submenu && (
              <ul className="absolute left-0 mt-2 bg-yellow-600 text-black shadow-lg rounded-md hidden group-hover:block z-50">
                {item.submenu.map((sub) => (
                  <li key={sub.title}>
                    <Link to={sub.path} className="block px-4 py-2 hover:bg-yellow-700">
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

// Componente para Navbar no Mobile
const MobileNavbar = ({ menuOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (title) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <nav className="bg-yellow-500 text-black p-4 shadow-md md:hidden">
      <div className="flex justify-between items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-xl">☰</button>
      </div>
      <ul className={`mt-2 ${isOpen ? "block" : "hidden"}`}>
        {menuOptions.map((item) => (
          <li key={item.title} className="relative">
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className="w-full text-left px-4 py-2 hover:bg-yellow-600"
                >
                  {item.title} ▼
                </button>
                {openSubmenus[item.title] && (
                  <ul className="bg-yellow-700 text-black rounded-md">
                    {item.submenu.map((sub) => (
                      <li key={sub.title}>
                        <Link to={sub.path} className="block px-4 py-2 hover:bg-yellow-800">
                          {sub.title}
                        </Link>
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
        ))}
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

  return isMobile ? <MobileNavbar menuOptions={menuOptions} /> : <DesktopNavbar menuOptions={menuOptions} />;
};

export default Navbar;
