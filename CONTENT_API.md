# API de conteúdo

Todo o conteúdo do site (páginas institucionais e notícias) vem de `src/services/contentApi.js` — **sem WordPress**.

## Configuração

```env
REACT_APP_CONTENT_API_URL=http://localhost:3001/api
REACT_APP_CONTENT_USE_LOCAL_STORE=true
REACT_APP_ADMIN_TOKEN=sua-senha
```

### Armazenamento local (padrão)

Com `REACT_APP_CONTENT_USE_LOCAL_STORE=true`, o conteúdo fica no **localStorage** do navegador (não precisa de servidor em `localhost:3001`). A página **Kyokushinkaikan** já vem pré-carregada a partir do layout legado (`npm run seed:content` regenera `src/data/contentSeeds/kyokushinkaikan.json`).

No admin, use **Restaurar conteúdo original** se a página aparecer vazia.

## Endpoints

- `GET /content/pages` — listar
- `GET /content/pages/:slug` — ler página
- `POST /content/pages` — criar
- `PUT /content/pages/:id` — atualizar (rascunho ou publicado)
- `DELETE /content/pages/:id`
- Seções e blocos: ver `contentApi.js`

## Contrato no front

Normalização em `src/services/contentNormalizer.js`:

- `page` → `sections[]` → `children[]` (subcategorias)
- `block`: `text` | `image` | `youtube` (YouTube usa `videoId` / `embedId`)

Renderização: `PageContentRenderer` + `InstitutionalPage`.

## Admin

Rotas protegidas em `/admin/conteudo` (ver `REACT_APP_ADMIN_TOKEN`).

## Feature flag (piloto)

```env
REACT_APP_USE_CONTENT_API=true
```

| Valor | `kyokushinkaikan` | Demais institucionais | Notícias |
|-------|-------------------|----------------------|----------|
| `false` (padrão) | Legado hardcoded | contentApi | WordPress |
| `true` | contentApi + PageContentRenderer | contentApi | WordPress |

Expandir piloto: adicionar slugs em `src/config/featureFlags.js` → `CONTENT_API_PILOT_SLUGS`.

## Notícias

`src/pages/Noticias.js` usa **WordPress** (`wordpressApi`) — não é afetada pela flag.
