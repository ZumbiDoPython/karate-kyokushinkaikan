# API de conteúdo

Todo o conteúdo do site (páginas institucionais e notícias) vem de `src/services/contentApi.js` — **sem WordPress**.

## Configuração

```env
REACT_APP_CONTENT_API_URL=http://localhost:3001/api
REACT_APP_CONTENT_USE_LOCAL_STORE=true
REACT_APP_ADMIN_TOKEN=sua-senha
```

### Armazenamento local (desenvolvimento)

Com `REACT_APP_CONTENT_USE_LOCAL_STORE=true`, o conteúdo fica no **localStorage** do navegador. A página **Kyokushinkaikan** já vem pré-carregada a partir do layout legado (`npm run seed:content` regenera `src/data/contentSeeds/kyokushinkaikan.json`).

### Cloud Firestore (produção)

```env
REACT_APP_CONTENT_USE_FIRESTORE=true
REACT_APP_CONTENT_USE_LOCAL_STORE=false
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
# ... demais REACT_APP_FIREBASE_*
```

- Coleção `pages` (documento = slug)
- Leitura pública; escrita com **Firebase Auth** (e-mail/senha) no `/admin/login`
- Site público: só páginas `published` (fallback para seed embutido no build)
- Primeira carga: admin → **Restaurar conteúdo original**

Ver `DEPLOY.md` para deploy no domínio Firebase existente.

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
- `block`: `text` | `image` | `youtube` | `link` (YouTube usa `videoId` / `embedId`; link usa `label` + `href`)
- `contentRevision` (número): incrementa a cada salvamento; o editor envia a revisão que carregou e bloqueia se outra pessoa salvou antes (conflito de edição)
- Metadados de auditoria (opcionais): `lastEditedBy`, `lastEditedByEmail`, `lastEditedAt` — preenchidos ao salvar/publicar no admin

## Admin

- `/admin/conteudo` — listar e editar páginas
- `/admin/usuarios` — como adicionar editores no Firebase Authentication
- Mover blocos entre subseções: menu **Mover para seção** ou arrastar (⠿) para a árvore de seções

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
