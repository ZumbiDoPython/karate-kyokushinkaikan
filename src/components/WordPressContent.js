import React, { useEffect, useRef } from 'react';

/**
 * Componente para renderizar conteúdo HTML do WordPress de forma segura
 * Extrai imagens, vídeos e formata o conteúdo adequadamente
 */
const WordPressContent = ({ content, className = '' }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Processar imagens para centralizar e adicionar classes
    const images = contentRef.current.querySelectorAll('img');
    images.forEach((img) => {
      img.className = 'mx-auto my-4 rounded shadow-md max-w-full h-auto block';
      img.style.cursor = 'pointer';
      
      // Adicionar evento de clique para ampliar
      img.addEventListener('click', () => {
        window.open(img.src, '_blank');
      });
    });

    // Processar vídeos do YouTube
    const iframes = contentRef.current.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      if (iframe.src.includes('youtube.com') || iframe.src.includes('youtu.be')) {
        iframe.className = 'mx-auto my-4 block';
        iframe.style.maxWidth = '100%';
      }
    });

    // Processar links
    const links = contentRef.current.querySelectorAll('a');
    links.forEach((link) => {
      if (link.href.includes('shope.ee') || link.href.includes('shopee')) {
        link.className = 'text-blue-600 hover:text-blue-800 underline font-semibold';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        link.className = 'text-blue-600 hover:text-blue-800 underline';
      }
    });

    // Processar tabelas - tornar responsivas
    const tables = contentRef.current.querySelectorAll('table');
    tables.forEach((table) => {
      // Verificar se já está envolvida
      if (table.parentElement?.classList.contains('table-wrapper')) {
        return;
      }
      
      table.className = 'w-full border-collapse border border-gray-300 my-4';
      
      // Envolver tabela em div responsiva
      const wrapper = document.createElement('div');
      wrapper.className = 'overflow-x-auto my-4 table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Processar células de tabela
    const cells = contentRef.current.querySelectorAll('td, th');
    cells.forEach((cell) => {
      cell.className = 'border border-gray-300 px-4 py-2';
    });

    // Processar parágrafos
    const paragraphs = contentRef.current.querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (!p.querySelector('img') && !p.querySelector('a[href*="shope"]')) {
        p.className = 'mb-4 text-gray-700 leading-relaxed';
      }
    });

    // Processar títulos
    const h1s = contentRef.current.querySelectorAll('h1');
    h1s.forEach((h1) => {
      h1.className = 'text-3xl font-bold mb-4 mt-8 text-gray-900';
    });

    const h2s = contentRef.current.querySelectorAll('h2');
    h2s.forEach((h2) => {
      h2.className = 'text-2xl font-semibold mb-4 mt-6 text-gray-800';
    });

    const h3s = contentRef.current.querySelectorAll('h3');
    h3s.forEach((h3) => {
      h3.className = 'text-xl font-semibold mb-3 mt-4 text-gray-800';
    });

    const h4s = contentRef.current.querySelectorAll('h4');
    h4s.forEach((h4) => {
      h4.className = 'text-lg font-semibold mb-2 mt-3 text-gray-700';
    });

    // Processar listas
    const lists = contentRef.current.querySelectorAll('ul, ol');
    lists.forEach((list) => {
      list.className = 'mb-4 ml-6 space-y-2';
    });

    const listItems = contentRef.current.querySelectorAll('li');
    listItems.forEach((li) => {
      li.className = 'text-gray-700';
    });

    // Processar strong/bold para destacar preços e valores
    const strongs = contentRef.current.querySelectorAll('strong, b');
    strongs.forEach((strong) => {
      const text = strong.textContent;
      if (text.includes('R$') || text.match(/\d+\.\d+/)) {
        strong.className = 'text-yellow-600 font-bold text-lg';
      }
    });

  }, [content]);

  if (!content) {
    return <div className="text-gray-500">Conteúdo não disponível</div>;
  }

  return (
    <div
      ref={contentRef}
      className={`wordpress-content ${className} prose prose-lg max-w-none`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default WordPressContent;

