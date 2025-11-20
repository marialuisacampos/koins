# Koins Backend API

Backend API para o Koins construído com Fastify, TypeScript e Prisma.

## ✅ Funcionalidades Implementadas

### Setup Inicial (Fase 1 - Concluída)
- ✅ Prisma ORM com PostgreSQL (Supabase)
- ✅ Sistema de error handling robusto
- ✅ Logger estruturado
- ✅ Segurança (Helmet, CORS, Rate Limiting)
- ✅ Hash de senhas (bcrypt)
- ✅ Validação de dados (Zod)
- ✅ Tipos TypeScript completos
- ✅ Graceful shutdown
- ✅ Health check endpoint

### Autenticação (Fase 2 - Concluída) ✨
- ✅ POST /api/auth/signup - Cadastro com criação automática de convite
- ✅ POST /api/auth/login - Login com JWT
- ✅ POST /api/auth/refresh - Renovar access token
- ✅ POST /api/auth/forgot-password - Solicitar reset de senha
- ✅ POST /api/auth/reset-password - Resetar senha com token
- ✅ POST /api/auth/logout - Logout
- ✅ Middleware de autenticação JWT
- ✅ Validação completa com Zod
- ✅ Integração com Connection (convites automáticos)
- ✅ **Sistema de convites para parceiros não cadastrados**
- ✅ **Vinculação automática de convites ao cadastro**
- ✅ **114 testes unitários (100% passando)**
- ✅ **~90% de cobertura de código**

### Database Models
- ✅ User (usuários)
- ✅ Connection (conexões entre pares)
- ✅ Expense (despesas e transferências)
- ✅ Subscription (assinaturas)
- ✅ UserSubscription (join table)

## Estrutura

```
backend/
├── prisma/
│   └── schema.prisma          # ✅ Modelos do banco
├── scripts/
│   ├── setup-env.sh           # ✅ Setup do .env
│   └── generate-secrets.js    # ✅ Gerador de secrets JWT
├── src/
│   ├── config/
│   │   └── database.ts        # ✅ Configuração do Prisma
│   ├── controllers/
│   │   └── auth.controller.ts # ✅ Controller de auth
│   ├── middleware/
│   │   ├── auth.ts            # ✅ Middleware JWT
│   │   ├── errorHandler.ts    # ✅ Error handling
│   │   └── notFound.ts        # ✅ 404 handler
│   ├── repositories/
│   │   ├── user.repository.ts       # ✅ User repository
│   │   └── connection.repository.ts # ✅ Connection repository
│   ├── routes/
│   │   └── auth.routes.ts     # ✅ Rotas de auth
│   ├── schemas/
│   │   └── auth.schema.ts     # ✅ Schemas Zod
│   ├── services/
│   │   └── auth.service.ts    # ✅ Lógica de auth
│   ├── types/
│   │   └── index.ts           # ✅ Tipos TypeScript
│   ├── utils/
│   │   ├── crypto.ts          # ✅ Bcrypt + tokens
│   │   ├── errors.ts          # ✅ Classes de erro
│   │   ├── jwt.ts             # ✅ JWT utils
│   │   ├── logger.ts          # ✅ Logger
│   │   └── passwordReset.ts   # ✅ Reset token manager
│   └── server.ts              # ✅ Servidor Fastify
├── docs/
│   └── API.md                 # ✅ Documentação completa
├── tests/
│   └── auth.test.http         # ✅ Testes HTTP
├── SETUP.md                   # ✅ Guia de setup
└── README.md
```

## Tecnologias

- **Fastify 4** - Framework web
- **TypeScript 5** - Type safety
- **Prisma** - ORM para PostgreSQL
- **Supabase** - PostgreSQL gerenciado
- **bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **JWT** - Autenticação stateless
- **@fastify/cors** - CORS
- **@fastify/helmet** - Security headers
- **@fastify/rate-limit** - Rate limiting
- **tsx** - TypeScript execution

## Quick Start

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar ambiente

```bash
./scripts/setup-env.sh
npm run generate-secrets
```

Configure o `.env` com:
- `DATABASE_URL` do Supabase
- `JWT_SECRET` e `JWT_REFRESH_SECRET` gerados

### 3. Criar tabelas no banco

```bash
npm run db:generate
npm run db:push
```

### 4. Rodar servidor

```bash
npm run dev
```

Servidor rodando em `http://localhost:3000` 🚀

**Ver [SETUP.md](./SETUP.md) para instruções detalhadas**

## Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm run start            # Rodar build de produção
npm run lint             # Linter
npm run generate-secrets # Gerar JWT secrets
npm run db:generate      # Gerar Prisma Client
npm run db:push          # Aplicar schema no banco
npm run db:migrate       # Criar migration
npm run db:studio        # Prisma Studio
```

## API Endpoints

### Públicos
- `GET /health` - Health check

### Autenticação (`/api/auth`)
- `POST /signup` - Cadastro
- `POST /login` - Login
- `POST /refresh` - Renovar token
- `POST /forgot-password` - Solicitar reset
- `POST /reset-password` - Resetar senha
- `POST /logout` - Logout

**Ver documentação completa em [docs/API.md](./docs/API.md)**

## Testar a API

### Usando arquivo .http (VSCode REST Client)

```bash
# Abrir o arquivo tests/auth.test.http
# Clicar em "Send Request" acima de cada requisição
```

### Usando curl

```bash
# Cadastro
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "Senha123!"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "Senha123!"
  }'
```

## Segurança Implementada

- ✅ **Helmet** - Security headers (CSP, XSS, HSTS)
- ✅ **CORS restrito** - Apenas frontend autorizado
- ✅ **Rate Limiting** - 100 req/min
- ✅ **bcrypt** - Hash de senhas (12 rounds)
- ✅ **JWT** - Tokens com expiração (15min/7dias)
- ✅ **Validação** - Zod schemas em todos inputs
- ✅ **SQL Injection** - Prisma prepared statements
- ✅ **Password Policy** - Mínimo 8 chars, maiúscula, número
- ✅ **Error Handling** - Sem vazamento de dados sensíveis

## Clean Architecture

```
Routes → Controllers → Services → Repositories → Database
  ↓           ↓            ↓           ↓
 HTTP    Request/       Business    Data
 Layer   Response       Logic      Access
```

### Responsabilidades

- **Routes**: Definição de endpoints e middlewares
- **Controllers**: Validação de input e formatação de response
- **Services**: Lógica de negócio pura
- **Repositories**: Acesso ao banco de dados
- **Utils**: Funções auxiliares reutilizáveis

## Próximas Fases

### Fase 3: Connections (2h) 🔜
- [ ] POST /api/connections (criar convite)
- [ ] GET /api/connections (listar)
- [ ] PATCH /api/connections/:id/accept
- [ ] PATCH /api/connections/:id/reject
- [ ] DELETE /api/connections/:id (cancelar)

### Fase 4: Expenses (3h)
- [ ] POST /api/expenses
- [ ] GET /api/expenses (com filtros)
- [ ] DELETE /api/expenses/:id
- [ ] GET /api/expenses/balance

### Fase 5: User Profile (1h)
- [ ] GET /api/users/me
- [ ] PATCH /api/users/me
- [ ] POST /api/users/change-password

### Fase 6: Subscriptions (2-3h)
- [ ] Webhook Abacate Pay
- [ ] POST /api/subscriptions/checkout
- [ ] POST /api/subscriptions/cancel
- [ ] POST /api/subscriptions/upgrade

### Fase 7: Deploy & CI/CD
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] CI/CD Pipeline
- [ ] Deploy (Railway/Fly.io)

## Licença

Privado - Koins © 2025
