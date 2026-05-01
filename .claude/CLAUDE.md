# CLAUDE.md

## Visão Geral

**EducaTEA** é uma plataforma educacional full-stack para um Serious Game que treina professores em práticas inclusivas para alunos com Transtorno do Espectro Autista (TEA).

```
educa-tea-site/
├── educatea-frontend/   ← Next.js 16 + Tailwind CSS 4
└── educatea-backend/    ← Node.js + Express + TypeORM + MySQL
```

---

## Como Rodar o Projeto

### Pré-requisitos

- Node.js 20+
- MySQL rodando localmente (padrão: `localhost:3306`, banco `educatea`)

### 1. Backend

```bash
cd educatea-backend
cp .env.example .env        # preencher DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET
npm install
npm run dev                  # http://localhost:3001
```

O TypeORM cria/sincroniza as tabelas automaticamente na primeira execução (`synchronize: true` em dev).

### 2. Frontend

```bash
cd educatea-frontend
# criar .env.local com:
# NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev                  # http://localhost:3000
```

### Outros comandos

```bash
# Backend
npm run build   # tsc → dist/
npm start       # node dist/index.js (produção)

# Frontend
npm run build
npm start
```

### Verificação rápida

```bash
curl http://localhost:3001/api/health   # {"status":"ok"}
curl http://localhost:3000              # 200 OK
```

---

## Backend (`educatea-backend/`)

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| ORM | TypeORM (driver: mysql2) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Upload | multer → salva em `educatea-frontend/public/images/uploads/` |
| Linguagem | TypeScript |

### Arquitetura

App Express monolítico. Sequência de boot: `index.ts` inicializa o `AppDataSource` (MySQL via TypeORM) e depois sobe o servidor Express. Todas as rotas são registradas em `app.ts`.

`synchronize: true` em desenvolvimento — TypeORM cria/altera tabelas automaticamente. **Nunca usar em produção.**

As entidades são importadas explicitamente em `data-source.ts` (não usar glob de strings, pois é não confiável com ts-node-dev).

### Entidades (tabelas)

| Entidade | Tabela | Relações principais |
|----------|--------|---------------------|
| `User` | `users` | tem muitos `Comment`, `ChatbotSession`; tem um `AccessibilitySettings` |
| `Comment` | `comments` | pertence a `User`; `section` enum: `forum` / `comunidade`; auto-referência para replies via `parentId` |
| `Like` | `likes` | pertence a `User` e `Comment`; constraint única `(userId, commentId)` |
| `ChatbotSession` | `chatbot_sessions` | pertence a `User`; tem muitos `ChatbotMessage`, `ChatbotFeedback` |
| `ChatbotMessage` | `chatbot_messages` | pertence a `ChatbotSession` |
| `ChatbotFeedback` | `chatbot_feedback` | pertence a `ChatbotSession` |
| `NewsArticle` | `news_articles` | pertence a `User` (autor) |
| `AccessibilitySettings` | `accessibility_settings` | 1:1 com `User` |

### Armadilhas do TypeORM

- `find({ where: { campo: undefined } })` — o TypeORM **ignora** campos `undefined` no `where`, ou seja, não filtra nada. Para filtrar por NULL usar `IsNull()` importado de `typeorm`.
- Ao enriquecer listas de comentários com `likesCount`/`replyCount`, usar **queries em batch** (uma query agrupada por todos os IDs) em vez de queries individuais por comentário para evitar N+1.

### Rotas da API

```
POST   /api/auth/register                        — público
POST   /api/auth/login                           — público → retorna JWT
GET    /api/auth/me                              — JWT obrigatório

PUT    /api/users/:id                            — JWT (próprio usuário ou admin)
GET    /api/users/:id/accessibility              — JWT
PUT    /api/users/:id/accessibility              — JWT

GET    /api/comments?section=forum|comunidade    — público (apenas raiz, sem replies)
GET    /api/comments/mine                        — JWT (apenas posts raiz do usuário)
GET    /api/comments/:id                         — público
GET    /api/comments/:id/replies                 — público
POST   /api/comments                             — JWT obrigatório
PUT    /api/comments/:id                         — JWT (dono ou admin)
DELETE /api/comments/:id                         — JWT (dono ou admin)
POST   /api/comments/:id/like                    — JWT (toggle curtida)

POST   /api/upload                               — JWT; multipart/form-data campo "image"; máx 5MB

POST   /api/chatbot/sessions                     — público (sessões anônimas permitidas)
POST   /api/chatbot/sessions/:id/messages        — público
POST   /api/chatbot/sessions/:id/close           — público
POST   /api/chatbot/feedback                     — público

GET    /api/news                                 — público (só publicados)
GET    /api/news/:id                             — público
POST   /api/news                                 — JWT + role admin
PUT    /api/news/:id                             — JWT + role admin
DELETE /api/news/:id                             — JWT + role admin

GET    /api/health                               — público
```

### Middleware

- `authMiddleware` — verifica JWT, injeta `req.user: { id, email, role }`; retorna 401 se ausente/inválido
- `adminMiddleware` — exige `req.user.role === "admin"`; sempre encadear após `authMiddleware`
- `errorHandler` — handler global de erros; deve ser o último `app.use()`

### Upload de imagens

`uploadController.ts` usa multer para salvar arquivos em `educatea-frontend/public/images/uploads/`. A URL retornada é `/images/uploads/<filename>` — caminho relativo servido diretamente pelo Next.js.

---

## Frontend (`educatea-frontend/`)

### Stack

Next.js 16 App Router, React 19, Tailwind CSS 4, Framer Motion, Lucide React.

### Arquitetura de páginas

Páginas ficam em `app/(site)/` (route group). O `layout.js` envolve cada página nos providers e renderiza `Header`, `Footer`, chatbot widget e widget de acessibilidade ao redor de `{children}`.

Árvore de providers (topo → base):
```
UserProvider → LanguageProvider → AcessibilidadeProvider → ToastProvider → <body>
```

O `ToastProvider` deve ficar **dentro do `<body>`**, pois usa `ReactDOM.createPortal` para renderizar no `document.body`. Nunca mover para fora do `<body>` — causaria erro de hidratação.

### Contextos React (`context/`)

| Contexto | Hook | Responsabilidade |
|----------|------|-----------------|
| `UserContext.js` | `useUser()` | Auth: `login()`, `logout()`, `register()`, `getToken()`. JWT em `localStorage` chave `educatea_token`. No mount, chama `GET /api/auth/me` para restaurar sessão. Retorna `user` (objeto) ou `null`. |
| `LanguageContext.js` | `useLanguage()` | Troca de idioma (pt-br, en-us, es-es); persiste em `localStorage` chave `appLanguage` |
| `AcessibilidadeContext.jsx` | `useAcessibilidade()` | 14+ funcionalidades de acessibilidade, desfazer/refazer, presets para TDAH/dislexia/cegueira/idosos |
| `ToastContext.jsx` | `useToast()` | Notificações globais: `showToast(message, type, duration)`. Tipos: `success`, `error`, `warning`, `info`. Auto-dismiss em 4s. |

**Verificação de login:** usar `!!user` (não `user?.isLoggedIn` — o campo não existe na entidade).

### Chamadas de API no frontend

Todos os componentes usam `process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"` como base. Tokens Bearer são obtidos via `getToken()` do `useUser()`.

| Componente/Página | Endpoint |
|-------------------|----------|
| `Forum.jsx` | `GET /api/comments?section=forum` |
| `comunidade/page.jsx` | `GET /api/comments?section=comunidade` |
| `criar-post/page.jsx` | `POST /api/upload` + `POST /api/comments` |
| `meus-posts/page.jsx` | `GET /api/comments/mine`, `PUT /api/comments/:id`, `DELETE /api/comments/:id` |
| `ChatbotWidget.jsx` | `POST /api/chatbot/sessions` no mount; `POST .../close` ao fechar |
| `ChatbotCard.jsx` | `POST /api/chatbot/sessions/:id/messages` |
| `ChatBotCardFeedback.jsx` | `POST /api/chatbot/feedback` |
| `ModalUsuario.jsx` | `login()` / `register()` do `UserContext` |

### Páginas de comunidade

`app/(site)/comunidade/page.jsx` — Feed estilo X (Twitter):
- Layout de coluna única com sidebar direita (desktop) e barra de busca recolhível (mobile)
- Filtros: Recentes, Em alta, Senac, Professores, Personalizar — indicador animado via `layoutId` do Framer Motion
- Apenas posts raiz no feed (replies filtradas por `parentId === null` no backend e no cliente)
- Curtida com feedback otimista (atualiza imediatamente, reverte em erro)
- `ReplyModal` notifica o parent via `onReplyPosted(commentId)` para incrementar o contador em tempo real

### Header

`components/Header.jsx`:
- Botão de acesso rápido à Comunidade no desktop: pill com dot pulsante (`animate-ping`)
- Card de acesso rápido no menu mobile com dot verde "Feed ao vivo"
- Avatar dinâmico do usuário logado via `/images/avatars/${user.profilePicture}` ou inicial do nome como fallback

### Internacionalização

Todas as strings de UI ficam em `locales/translations.js` (três objetos: `ptBr`, `enUs`, `esEs`). Usar a função `t()` do `useLanguage()`. Sempre adicionar novas strings nos três objetos.

### CSS de Acessibilidade

`AcessibilidadeContext` aplica funcionalidades alternando classes/atributos no `<html>`:
- Classes: `a11y-alto-contraste`, `a11y-espacamento`, `a11y-fonte-legivel`, `a11y-parar-animacoes`, `a11y-destacar-links`, `a11y-cursor-gigante`, `dark`
- Atributo: `html[data-daltonismo]` (valores: `tritanopia` | `protanopia` | `deuteranopia`)

Todas as regras CSS de acessibilidade ficam em `app/(site)/globals.css`.

### Caminhos de imagens

- **Avatares:** backend armazena só o nome do arquivo (ex: `"avatar01.png"`). No frontend resolver como `/images/avatars/<filename>` (servido de `public/images/avatars/`).
- **Imagens de posts:** armazenadas como path completo `/images/uploads/<filename>` no campo `postImageUrl`. Se o valor não começar com `/`, prefixar com `/images/uploads/`.

---

## Identidade Visual

- Cor primária: `#1A3879` (azul escuro)
- Cor primária hover: `#152d63`
- Fonte: DM Sans (400, 500, 600, 700)
- Bordas arredondadas: `rounded-xl` / `rounded-2xl` / `rounded-full`
- Dark mode: suportado em todas as páginas e componentes via classe `dark` no `<html>`
