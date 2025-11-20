# Setup do Backend - Koins

## 1. Configurar variáveis de ambiente

### Opção A: Usando o script (recomendado)
```bash
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

### Opção B: Manualmente
Crie um arquivo `.env` na raiz do backend com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

JWT_SECRET="your-super-secret-jwt-key-min-64-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-64-chars"
JWT_REFRESH_EXPIRES_IN="7d"

PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

BCRYPT_ROUNDS=12

RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

## 2. Gerar secrets seguros para JWT

```bash
npm run generate-secrets
```

Copie os valores gerados para `JWT_SECRET` e `JWT_REFRESH_SECRET` no seu `.env`.

## 3. Configurar DATABASE_URL

### Pegar credenciais do Supabase:
1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em Settings > Database
3. Copie a "Connection string" em "URI"
4. Substitua `[YOUR-PASSWORD]` pela senha do banco
5. Cole no `.env` na variável `DATABASE_URL`

Exemplo:
```
DATABASE_URL="postgresql://postgres.xxxxx:senha@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

## 4. Gerar o Prisma Client

```bash
npx prisma generate
```

## 5. Criar as tabelas no banco

```bash
npx prisma db push
```

Ou para criar uma migration:
```bash
npx prisma migrate dev --name init
```

## 6. (Opcional) Abrir Prisma Studio

Para visualizar e editar dados no banco:
```bash
npx prisma studio
```

## 7. Iniciar o servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## Verificar se está funcionando

```bash
curl http://localhost:3000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T...",
  "environment": "development"
}
```

## Estrutura criada

```
backend/
├── prisma/
│   └── schema.prisma          # Modelos do banco de dados
├── src/
│   ├── config/
│   │   └── database.ts        # Configuração do Prisma
│   ├── middleware/
│   │   ├── errorHandler.ts    # Tratamento de erros
│   │   └── notFound.ts        # Handler 404
│   ├── types/
│   │   └── index.ts           # Tipos TypeScript
│   ├── utils/
│   │   ├── crypto.ts          # Funções de hash e crypto
│   │   ├── errors.ts          # Classes de erro customizadas
│   │   └── logger.ts          # Sistema de logs
│   └── server.ts              # Servidor Fastify
└── .env                       # Variáveis de ambiente (criar)
```

## Próximos passos

Após o setup inicial estar funcionando, implementar:
1. Sistema de autenticação (signup, login, JWT)
2. CRUD de connections
3. CRUD de expenses
4. Cálculo de saldo
5. Integração com Abacate Pay para subscriptions

