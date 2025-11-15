# Koins Backend API

Backend API para o Koins construído com Fastify e TypeScript.

## Estrutura

```
backend/
├── src/
│   ├── routes/        # Rotas da API (vazio - a implementar)
│   ├── controllers/   # Controllers (vazio - a implementar)
│   ├── services/      # Lógica de negócio (vazio - a implementar)
│   ├── models/        # Modelos de dados (vazio - a implementar)
│   ├── middleware/    # Middlewares (vazio - a implementar)
│   ├── config/        # Configurações (vazio - a implementar)
│   └── server.ts      # Entry point - servidor Fastify
├── .env.example       # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## Tecnologias

- Fastify 4
- TypeScript 5
- @fastify/cors - CORS
- @fastify/helmet - Segurança
- @fastify/jwt - Autenticação (quando configurar)
- tsx - Executar TypeScript em desenvolvimento

## Desenvolvimento

### Instalar dependências

```bash
npm install
```

### Configurar ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env conforme necessário
```

### Rodar em desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Rotas disponíveis

- `GET /health` - Health check do servidor

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

## TODO

- [ ] Configurar banco de dados (Prisma ou similar)
- [ ] Implementar rotas de autenticação
- [ ] Implementar rotas de usuários
- [ ] Implementar rotas de despesas
- [ ] Implementar rotas de convites
- [ ] Adicionar validação de schemas
- [ ] Adicionar testes
- [ ] Configurar migrations
- [ ] Documentar API (Swagger/OpenAPI)

