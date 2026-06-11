# Deploy gratuito (produção)

Este projeto é um **React (CRA)** estático no **Firebase Hosting** (plano **Spark = gratuito**). O CMS institucional pode usar **Cloud Firestore** no mesmo projeto Firebase — mantenha o **domínio customizado** que já está no console (Hosting → Domínios).

## O que você ganha de graça

| Serviço | Uso | Custo inicial |
|---------|-----|----------------|
| **Firebase Hosting** | Site + domínio atual | Grátis |
| **Cloud Firestore** | Páginas institucionais (`pages/*`) | Grátis (tier Spark) |
| **Firebase Auth** | Login do admin (e-mail/senha) | Grátis |
| **Notícias** | WordPress em `kyokushinkaikan.com.br` | Já existente |
| **Galeria (opcional)** | Supabase free tier | Grátis com limites |

## Modos de armazenamento

| Modo | Variáveis | Quem vê as edições do admin |
|------|-----------|------------------------------|
| **Firestore** (produção) | `REACT_APP_CONTENT_USE_FIRESTORE=true`, `REACT_APP_CONTENT_USE_LOCAL_STORE=false` + `REACT_APP_FIREBASE_*` | Todos os visitantes |
| **localStorage** (dev) | `REACT_APP_CONTENT_USE_LOCAL_STORE=true` | Só o mesmo navegador |

---

## Passo a passo — Firebase (Hosting + Firestore)

### 1. Console Firebase (projeto existente)

1. [Firebase Console](https://console.firebase.google.com/) — use o **mesmo projeto** do domínio atual.
2. **Authentication** → Sign-in method → ative **E-mail/senha** → crie um usuário admin.
3. **Firestore Database** → criar banco (modo produção) — coleção `pages` será criada pelo app.
4. **Configurações do projeto** → copie o objeto `firebaseConfig` (app Web).

### 2. CLI

```powershell
npm install -g firebase-tools
firebase login
firebase use --add
```

Escolha o projeto já ligado ao domínio.

### 3. Variáveis de produção

```powershell
copy .env.production.example .env.production
```

Edite `.env.production`:

```env
REACT_APP_USE_CONTENT_API=true
REACT_APP_CONTENT_USE_FIRESTORE=true
REACT_APP_CONTENT_USE_LOCAL_STORE=false
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
# ... demais REACT_APP_FIREBASE_*
```

O CRA lê `.env.production` no `npm run build`.

### 4. Build e deploy

```powershell
npm install
npm run build
firebase deploy --only hosting,firestore:rules
```

Ou:

```powershell
npm run deploy
```

Isso publica o site **e** as regras do Firestore (`firestore.rules`: leitura pública, escrita só autenticado).

### 5. Primeira carga de conteúdo

1. Acesse `https://seu-dominio/admin/login`
2. Entre com o usuário criado no Firebase Auth
3. Em **Páginas institucionais** → **Restaurar conteúdo original** (publica os seeds no Firestore)
4. Edite e **Publique** — visitantes passam a ver a versão publicada

### 6. Domínio

Não é preciso mudar DNS se o domínio customizado já aponta para este projeto. Novos deploys só atualizam os arquivos em `build/`.

---

## Regras de segurança (Firestore)

Arquivo `firestore.rules`:

- **read** em `pages/{id}`: público (site visitante)
- **write**: apenas `request.auth != null` (admin logado no Firebase Auth)

---

## Desenvolvimento local

`.env` (não commitar):

```env
REACT_APP_USE_CONTENT_API=true
REACT_APP_CONTENT_USE_LOCAL_STORE=true
REACT_APP_CONTENT_USE_FIRESTORE=false
REACT_APP_ADMIN_TOKEN=admin
```

Para testar Firestore localmente, use `REACT_APP_CONTENT_USE_FIRESTORE=true` com as mesmas `REACT_APP_FIREBASE_*` do projeto.

---

## Checklist antes de publicar

- [ ] `npm run build` sem erros
- [ ] `firebase deploy --only hosting,firestore:rules`
- [ ] Usuário admin criado no Firebase Auth
- [ ] Seed restaurado uma vez no admin (Firestore)
- [ ] `.env` / `.env.production` não commitados com segredos
