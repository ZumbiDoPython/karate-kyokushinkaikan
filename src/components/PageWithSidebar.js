import React, { useCallback, useState, useEffect } from 'react';
import { useHashScroll } from '../hooks/useHashScroll';

// Função utilitária para buscar h2/h3 dentro de uma seção
function getSectionHeadings(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return [];
  const nodes = Array.from(section.querySelectorAll('h2, h3'));
  const result = [];
  let lastH2 = null;
  nodes.forEach(node => {
    const id = node.id || node.textContent.replace(/\s+/g, '-').toLowerCase();
    node.id = id;
    if (node.tagName === 'H2') {
      lastH2 = { id, text: node.textContent, children: [] };
      result.push(lastH2);
    } else if (node.tagName === 'H3' && lastH2) {
      lastH2.children.push({ id, text: node.textContent });
    }
  });
  return result;
}

const PageWithSidebar = ({ 
  children, 
  menuItems = [],
  sidebarContent = null 
}) => {
  useHashScroll();
  // Estado para controlar dropdown aberto por nível: { main: 'fundadores', sub: 'fundadores-h2-oyama' }
  const [openDropdown, setOpenDropdown] = useState({ main: null, sub: null });
  const [sectionHeadings, setSectionHeadings] = useState({});

  // Atualiza os headings de cada seção após render
  useEffect(() => {
    const map = {};
    menuItems.forEach(item => {
      map[item.target] = getSectionHeadings(item.target);
    });
    setSectionHeadings(map);
  }, [children, menuItems]);

  const handleMenuClick = useCallback((target) => {
    const section = document.getElementById(target);
    if (section) {
      window.history.pushState(null, '', `#${target}`);
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Abre o dropdown do nível (main ou sub) e fecha os outros do mesmo nível
  const handleDropdown = (level, id) => {
    setOpenDropdown(prev => ({
      ...prev,
      [level]: prev[level] === id ? null : id
    }));
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Menu lateral/topo */}
      <aside className="w-full md:w-64 bg-gray-100 p-4 shadow-md md:h-screen sticky top-0 z-10">
        <nav>
          <ul className="flex md:flex-col justify-around">
            {menuItems.map((item) => {
              const headings = sectionHeadings[item.target] || [];
              return (
                <li key={item.target} className="mb-2 md:mb-4">
                  <div className="flex items-center">
                    <button
                      className="cursor-pointer text-blue-600 hover:underline text-sm md:text-base flex-1 text-left"
                      onClick={() => handleMenuClick(item.target)}
                    >
                      {item.label}
                    </button>
                    {headings.length > 0 && (
                      <button
                        className="ml-2 text-xs text-gray-600"
                        onClick={() => handleDropdown('main', item.target)}
                        aria-label="Abrir submenu"
                      >
                        {openDropdown.main === item.target ? '▲' : '▼'}
                      </button>
                    )}
                  </div>
                  {headings.length > 0 && openDropdown.main === item.target && (
                    <ul className="ml-4 mt-1 border-l border-gray-300 pl-2">
                      {headings.map((h2) => {
                        const h2DropdownId = `${item.target}-h2-${h2.id}`;
                        return (
                          <li key={h2.id} className="mb-1">
                            <div className="flex items-center">
                              <button
                                className="cursor-pointer text-blue-500 hover:underline text-xs text-left flex-1"
                                onClick={() => handleMenuClick(h2.id)}
                              >
                                {h2.text}
                              </button>
                              {h2.children.length > 0 && (
                                <button
                                  className="ml-1 text-xs text-gray-600"
                                  onClick={() => handleDropdown('sub', h2DropdownId)}
                                  aria-label="Abrir subsubmenu"
                                >
                                  {openDropdown.sub === h2DropdownId ? '▲' : '▼'}
                                </button>
                              )}
                            </div>
                            {h2.children.length > 0 && openDropdown.sub === h2DropdownId && (
                              <ul className="ml-4 border-l border-gray-200 pl-2">
                                {h2.children.map((h3) => (
                                  <li key={h3.id} className="mb-1">
                                    <button
                                      className="cursor-pointer text-blue-400 hover:underline text-xs text-left"
                                      onClick={() => handleMenuClick(h3.id)}
                                    >
                                      {h3.text}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {sidebarContent && (
          <div className="mt-8">
            {sidebarContent}
          </div>
        )}
      </aside>
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
  );
};

export default PageWithSidebar; 