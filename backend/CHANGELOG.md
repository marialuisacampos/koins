# Changelog - Koins Backend

## [Unreleased]

### Added
- Sistema de convites para parceiros não cadastrados
  - Campo `partner_email` na tabela `connections`
  - Campo `user_id_to` agora é opcional (nullable)
  - Método `findByPartnerEmail()` no `ConnectionRepository`
  - Método `updatePartnerConnection()` no `ConnectionRepository`
  - Vinculação automática de convites pendentes ao cadastro
  - Índice em `partner_email` para performance
  - 6 novos testes para fluxo de convites
  - Documentação completa do fluxo em `docs/PARTNER_INVITE_FLOW.md`

### Changed
- `auth.service.ts`:
  - Verifica convites pendentes ao criar novo usuário
  - Cria connection com `partner_email` quando parceiro não existe
  - Vincula automaticamente usuário a convites pendentes
- `connection.repository.ts`:
  - Método `create()` aceita `user_id_to` e `partner_email` opcionais
  - Adicionados novos métodos para gerenciar convites pendentes

### Technical Details
- Total de testes: 108 → 114 (6 novos)
- Cobertura mantida em ~90%
- Schema do Prisma atualizado
- Migration pendente (rodar `npm run db:push` ou `npm run db:migrate`)

---

## [0.2.0] - 2025-11-15

### Added
- Suite completa de testes unitários (108 testes)
- Cobertura de código: 89.75%
- Vitest como framework de testes
- Documentação de testes em `docs/TESTING.md`

### Features
- ✅ Autenticação completa (signup, login, refresh, forgot/reset password)
- ✅ Middleware JWT
- ✅ Validação com Zod
- ✅ Error handling robusto
- ✅ Logger estruturado
- ✅ Segurança (bcrypt, rate limiting, CORS, Helmet)

---

## [0.1.0] - 2025-11-15

### Added
- Setup inicial do backend com Fastify
- Prisma ORM configurado
- Modelos do banco de dados:
  - User
  - Connection
  - Expense
  - Subscription
  - UserSubscription
- Estrutura de pastas (repositories, services, controllers, middleware, utils)
- Sistema de logs
- Variáveis de ambiente
- Scripts de setup
- Health check endpoint
- Documentação inicial

