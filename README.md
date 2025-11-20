# Koins

**Equilíbrio financeiro a dois** 🐟

Aplicativo PWA para gerenciar finanças compartilhadas de forma simples e colaborativa.

## Estrutura do Projeto

```
koins/
├── pwa/          # App PWA (React + TypeScript + Vite)
├── backend/      # API Backend (Fastify + TypeScript)
├── landing/      # Landing Page (em desenvolvimento)
└── README.md
```

## Tecnologias

### PWA (Frontend)

- React 18
- TypeScript 5
- Vite 5
- React Router v6
- SCSS (Sass)
- Lucide React (ícones)

### Backend (API)

- Fastify 4
- TypeScript 5
- Prisma (ORM)
- PostgreSQL (Supabase)
- bcrypt (hash de senhas)
- Zod (validação)
- CORS, Helmet, Rate Limiting
- JWT (autenticação)

## Desenvolvimento

### Instalação

```bash
# Instalar dependências de todos os projetos
npm run install:all
```

### Rodar o projeto

```bash
# Rodar PWA e Backend simultaneamente
npm run dev

# Ou rodar individualmente:
npm run dev:pwa      # PWA em http://localhost:5173
npm run dev:backend  # API em http://localhost:3000
```

### Build

```bash
# Build de tudo
npm run build

# Ou individualmente:
npm run build:pwa
npm run build:backend
```

## Estrutura Detalhada

### PWA (`/pwa`)

```
pwa/
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── styles/        # Estilos globais e temas
│   └── main.tsx       # Entry point
├── public/            # Arquivos estáticos
└── vite.config.ts     # Configuração Vite
```

### Backend (`/backend`)

```
backend/
├── prisma/
│   └── schema.prisma          # Modelos do banco
├── scripts/
│   ├── setup-env.sh           # Setup automático
│   └── generate-secrets.js    # Gerador de JWT secrets
├── src/
│   ├── config/
│   │   └── database.ts        # Prisma config
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling
│   │   └── notFound.ts        # 404 handler
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Crypto, logger, errors
│   ├── routes/                # Rotas (próxima fase)
│   ├── controllers/           # Controllers (próxima fase)
│   ├── services/              # Business logic (próxima fase)
│   └── server.ts              # Entry point
├── SETUP.md                   # Guia de configuração
└── README.md
```

## Funcionalidades

### Implementadas

- ✅ Sistema de autenticação (Login, Cadastro, Recuperação de senha)
- ✅ Dashboard com estados de conexão entre pares
- ✅ Gerenciamento de despesas compartilhadas
- ✅ Extrato completo com filtros
- ✅ Configurações (troca de senha, plano, cancelamento)
- ✅ Design system completo com SCSS
- ✅ Componentes reutilizáveis
- ✅ PWA com manifest e ícones

### Backend (Fase 1 - Setup Completo)

- ✅ Estrutura base do backend
- ✅ Prisma ORM + Supabase
- ✅ Models: User, Connection, Expense, Subscription
- ✅ Error handling robusto
- ✅ Logger estruturado
- ✅ Segurança (Helmet, CORS, Rate Limiting, bcrypt)
- ✅ Tipos TypeScript completos
- ✅ Scripts de setup automatizados

### Em Desenvolvimento

- 🚧 Autenticação JWT (signup, login, refresh)
- 🚧 CRUD de Connections
- 🚧 CRUD de Expenses
- 🚧 Cálculo de saldo
- 🚧 Landing Page
- 🚧 Integração Backend + Frontend
- 🚧 Webhooks de pagamento (Abacate Pay)

## Deploy

- **PWA**: Vercel/Netlify
- **Backend**: Railway/Render/Fly.io
- **Landing**: Vercel/Netlify

## Licença

Proprietary

---

Desenvolvido com 🧡 para casais que querem equilibrar suas finanças
