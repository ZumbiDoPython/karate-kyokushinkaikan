import { useEffect, useState } from 'react';

// Retorna [{id, text, children: [{id, text}]}]
export function useSidebarHeadings() {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // Seleciona todos os h2 e h3 visíveis no conteúdo principal
    const content = document.querySelector('main');
    if (!content) return;
    const nodes = Array.from(content.querySelectorAll('h2, h3'));
    const result = [];
    let lastH2 = null;
    nodes.forEach(node => {
      const id = node.id || node.textContent.replace(/\s+/g, '-').toLowerCase();
      node.id = id; // Garante que tenha id
      if (node.tagName === 'H2') {
        lastH2 = { id, text: node.textContent, children: [] };
        result.push(lastH2);
      } else if (node.tagName === 'H3' && lastH2) {
        lastH2.children.push({ id, text: node.textContent });
      }
    });
    setHeadings(result);
  }, []);

  return headings;
} 