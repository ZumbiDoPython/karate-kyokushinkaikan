import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useHashScroll = () => {
  const location = useLocation();

  useEffect(() => {
    // Só faz scroll se houver hash na URL
    if (location.hash) {
      const id = location.hash.replace('#', '');
      
      // Função para fazer scroll
      const scrollToSection = () => {
        const section = document.getElementById(id);
        if (section) {
          // Aguarda um pouco mais para garantir que o DOM está pronto
          setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      };

      // Tenta fazer scroll imediatamente
      scrollToSection();
      
      // Se não funcionou, tenta novamente após um delay maior
      const timeoutId = setTimeout(scrollToSection, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [location.hash]); // Só depende do hash, não do pathname
}; 