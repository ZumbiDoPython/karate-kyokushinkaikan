import React, { useCallback, useState } from 'react';
import { useHashScroll } from '../hooks/useHashScroll';

/**
 * @typedef {Object} SidebarMenuItem
 * @property {string} label
 * @property {string} target
 * @property {SidebarMenuItem[]} [children]
 */

/**
 * Monta submenu a partir dos headings dentro de uma seção (fallback DOM).
 * @param {string} sectionId
 */
function getSectionHeadingsFromDom(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return [];

  const nodes = Array.from(section.querySelectorAll('h2, h3, h4, h5, h6'));
  /** @type {SidebarMenuItem[]} */
  const stack = [];
  /** @type {SidebarMenuItem[]} */
  const roots = [];

  nodes.forEach((node) => {
    const id = node.id || node.textContent.replace(/\s+/g, '-').toLowerCase();
    node.id = id;

    const level = parseInt(node.tagName.charAt(1), 10);
    const item = { label: node.textContent.trim(), target: id, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(item);
    } else {
      stack[stack.length - 1].item.children.push(item);
    }

    stack.push({ level, item });
  });

  return filterSidebarMenuChildren(roots);
}

/**
 * No menu lateral, subseções só aparecem com 2 ou mais itens no mesmo nível.
 * @param {SidebarMenuItem[]} items
 * @returns {SidebarMenuItem[]}
 */
function filterSidebarMenuChildren(items) {
  if (!items?.length) return [];

  return items.map((item) => {
    let children = filterSidebarMenuChildren(item.children || []);
    if (children.length === 1) {
      children = [];
    }
    return { ...item, children };
  });
}

/**
 * @param {SidebarMenuItem} item
 * @param {(target: string) => void} onNavigate
 * @param {number} depth
 * @param {Set<string>} openMenus
 * @param {(id: string) => void} onToggle
 * @param {string} menuPath
 */
function SidebarMenuNode({
  item,
  onNavigate,
  depth,
  openMenus,
  onToggle,
  menuPath,
}) {
  const dropdownId = menuPath || item.target;
  const subItems = item.children || [];
  const hasChildren = subItems.length > 0;
  const showDropdown = subItems.length > 1;
  const isOpen = showDropdown && openMenus.has(dropdownId);

  const linkClass =
    depth === 0
      ? 'cursor-pointer text-blue-600 hover:underline text-sm md:text-base flex-1 text-left'
      : depth === 1
        ? 'cursor-pointer text-blue-500 hover:underline text-xs text-left flex-1'
        : 'cursor-pointer text-blue-400 hover:underline text-xs text-left flex-1';

  return (
    <li className={depth === 0 ? 'mb-2 md:mb-4' : 'mb-1'}>
      <div className="flex items-center" style={{ paddingLeft: depth > 0 ? Math.min(depth * 8, 24) : 0 }}>
        <button type="button" className={linkClass} onClick={() => onNavigate(item.target)}>
          {item.label}
        </button>
        {showDropdown && (
          <button
            type="button"
            className="ml-2 text-xs text-gray-600 shrink-0"
            onClick={() => onToggle(dropdownId)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Fechar submenu' : 'Abrir submenu'}
          >
            {isOpen ? '▲' : '▼'}
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul
          className={
            depth === 0
              ? 'ml-4 mt-1 border-l border-gray-300 pl-2'
              : 'ml-3 mt-1 border-l border-gray-200 pl-2'
          }
        >
          {subItems.map((child) => (
            <SidebarMenuNode
              key={`${dropdownId}-${child.target}`}
              item={child}
              onNavigate={onNavigate}
              depth={depth + 1}
              openMenus={openMenus}
              onToggle={onToggle}
              menuPath={`${dropdownId}/${child.target}`}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const PageWithSidebar = ({ children, menuItems = [], sidebarContent = null }) => {
  useHashScroll();
  const [openMenus, setOpenMenus] = useState(() => new Set());

  const handleMenuClick = useCallback((target) => {
    const el = document.getElementById(target);
    if (el) {
      window.history.pushState(null, '', `#${target}`);
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleToggle = useCallback((id) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resolveSubmenu = (item) => {
    if (item.children?.length) return item.children;
    return getSectionHeadingsFromDom(item.target);
  };

  const menuWithChildren = filterSidebarMenuChildren(
    menuItems.map((item) => ({
      ...item,
      children: resolveSubmenu(item),
    }))
  );

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-100 p-4 shadow-md md:h-screen sticky top-0 z-10 md:overflow-y-auto">
        <nav>
          <ul className="flex flex-col md:flex-col gap-1">
            {menuWithChildren.map((item) => (
              <SidebarMenuNode
                key={item.target}
                item={item}
                onNavigate={handleMenuClick}
                depth={0}
                openMenus={openMenus}
                onToggle={handleToggle}
                menuPath={item.target}
              />
            ))}
          </ul>
        </nav>
        {sidebarContent && <div className="mt-8">{sidebarContent}</div>}
      </aside>
      <div className="flex-1 relative">{children}</div>
    </div>
  );
};

export default PageWithSidebar;
