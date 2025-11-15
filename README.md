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
- CORS & Helmet
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
├── src/
│   ├── routes/        # Rotas da API
│   ├── controllers/   # Controllers
│   ├── services/      # Lógica de negócio
│   ├── models/        # Modelos de dados
│   ├── middleware/    # Middlewares
│   ├── config/        # Configurações
│   └── server.ts      # Entry point
└── package.json
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

### Em Desenvolvimento

- 🚧 Backend API
- 🚧 Landing Page
- 🚧 Integração Backend + Frontend
- 🚧 Banco de dados

## Deploy

- **PWA**: Vercel/Netlify
- **Backend**: Railway/Render/Fly.io
- **Landing**: Vercel/Netlify

## Licença

Proprietary

---

Desenvolvido com 🧡 para casais que querem equilibrar suas finanças
