# Integração WordPress - Documentação

## Visão Geral

O site React foi integrado com a API REST do WordPress (`https://kyokushinkaikan.com.br/wp-json`) para permitir que todo o conteúdo seja gerenciado dinamicamente através do WordPress.

## Estrutura Criada

### 1. Serviço de API (`src/services/wordpressApi.js`)
- Funções para buscar páginas, posts, categorias e mídia
- Mapeamento de rotas do React para slugs do WordPress
- Suporte para `_embed` para incluir dados relacionados (imagens, autor, etc)

### 2. Hooks Customizados (`src/hooks/useWordPress.js`)
- `usePage(slug)` - Buscar uma página por slug
- `usePosts(params)` - Buscar postagens
- `usePostsByCategory(categorySlug, params)` - Buscar posts por categoria
- `usePageByRoute(route)` - Buscar conteúdo baseado na rota
- `useCategories()` - Buscar todas as categorias
- `useMedia(params)` - Buscar mídia (imagens)

### 3. Contexto WordPress (`src/contexts/WordPressContext.js`)
- Provider global para gerenciar dados do WordPress
- Cache de páginas e posts para melhor performance
- Carregamento inicial de dados

### 4. Componentes

#### `WordPressContent` (`src/components/WordPressContent.js`)
- Renderiza HTML do WordPress de forma segura
- Processa e estiliza imagens, vídeos e conteúdo
- Centraliza imagens e vídeos automaticamente

#### `DynamicPage` (`src/components/DynamicPage.js`)
- Componente genérico para páginas dinâmicas
- Suporta fallback para conteúdo estático
- Integração com `PageWithSidebar` quando necessário

## Páginas Atualizadas

Todas as páginas foram atualizadas para buscar conteúdo do WordPress:

- **Home** (`/`) - Busca página com slug "home"
- **Kyokushinkaikan** (`/kyokushinkaikan`) - Mantém conteúdo estático como fallback
- **Kickboxing** (`/kickboxing`) - Busca do WordPress com fallback
- **Thai Boxing** (`/thai-boxing`) - Busca do WordPress
- **Galeria** (`/galeria`) - Busca imagens da biblioteca de mídia do WordPress
- **Notícias** (`/noticias`) - Lista posts do WordPress
- **Produtos** (`/produtos`) - Busca do WordPress
- **Contatos** (`/contatos`) - Busca do WordPress
- **Nagata Gym** (`/nagata-gym`) - Busca do WordPress

## Mapeamento de Rotas

O sistema mapeia automaticamente as rotas do React para slugs do WordPress:

```javascript
ROUTE_TO_SLUG_MAP = {
  '/': 'home',
  '/kyokushinkaikan': 'kyokushinkaikan',
  '/kickboxing': 'kickboxing',
  '/thai-boxing': 'thai-boxing',
  '/kobudo': 'kobudo',
  '/galeria': 'galeria',
  '/produtos': 'produtos',
  '/noticias': 'noticias',
  '/contatos': 'contatos',
  '/nagata-gym': 'nagata-gym',
}
```

## Como Usar

### No WordPress

1. Crie páginas com os slugs correspondentes às rotas
2. Para a galeria, adicione imagens na biblioteca de mídia
3. Para notícias, crie posts normalmente
4. O conteúdo será automaticamente exibido no site React

### Fallback

Todas as páginas têm conteúdo de fallback caso não encontrem dados no WordPress, garantindo que o site sempre funcione.

## Recursos Implementados

✅ Busca dinâmica de páginas e posts
✅ Galeria de imagens da biblioteca do WordPress
✅ Listagem de notícias com imagens destacadas
✅ Renderização segura de HTML do WordPress
✅ Estados de loading e erro
✅ Cache de dados para melhor performance
✅ Suporte a imagens destacadas (_embed)
✅ Fallback para conteúdo estático

## Próximos Passos

1. Configurar slugs corretos no WordPress para cada página
2. Adicionar imagens na biblioteca de mídia para a galeria
3. Criar posts de notícias no WordPress
4. Personalizar o conteúdo conforme necessário

