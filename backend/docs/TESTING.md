# Guia de Testes - Koins Backend

## Visão Geral

O backend utiliza **Vitest** como framework de testes, com cobertura completa de testes unitários para toda a camada de autenticação.

## Framework e Ferramentas

- **Vitest** - Framework de testes moderno e rápido
- **@vitest/ui** - Interface visual para testes
- **@vitest/coverage-v8** - Relatórios de cobertura
- **Mocks** - Isolamento de dependências

## Estrutura de Testes

```
src/
├── controllers/
│   └── __tests__/
│       └── auth.controller.test.ts
├── middleware/
│   └── __tests__/
│       └── auth.test.ts
├── repositories/
│   └── __tests__/
│       ├── user.repository.test.ts
│       └── connection.repository.test.ts
├── schemas/
│   └── __tests__/
│       └── auth.schema.test.ts
├── services/
│   └── __tests__/
│       └── auth.service.test.ts
├── tests/
│   ├── setup.ts              # Setup global
│   └── mocks/
│       └── prisma.mock.ts    # Mock do Prisma
└── utils/
    └── __tests__/
        ├── crypto.test.ts
        ├── errors.test.ts
        ├── jwt.test.ts
        └── passwordReset.test.ts
```

## Comandos

```bash
# Rodar todos os testes
npm test

# Modo watch (re-roda ao salvar)
npm run test:watch

# Interface visual
npm run test:ui

# Cobertura de código
npm run test:coverage
```

## Cobertura de Testes

### Utils (100%)
✅ **crypto.ts**
- hashPassword()
- comparePassword()
- generateRandomToken()

✅ **jwt.ts**
- generateTokens()
- verifyAccessToken()
- verifyRefreshToken()

✅ **passwordReset.ts**
- createPasswordResetToken()
- verifyPasswordResetToken()
- deletePasswordResetToken()

✅ **errors.ts**
- AppError
- BadRequestError
- UnauthorizedError
- ForbiddenError
- NotFoundError
- ConflictError
- ValidationError

### Repositories (100%)
✅ **user.repository.ts**
- create()
- findByEmail()
- findById()
- updatePassword()
- existsByEmail()

✅ **connection.repository.ts**
- create()
- findByUsers()
- findPendingByUserId()

### Services (100%)
✅ **auth.service.ts**
- signup()
- login()
- refresh()
- forgotPassword()
- resetPassword()

### Controllers (100%)
✅ **auth.controller.ts**
- signup()
- login()
- refresh()
- forgotPassword()
- resetPassword()
- logout()

### Schemas (100%)
✅ **auth.schema.ts**
- signupSchema
- loginSchema
- refreshTokenSchema
- forgotPasswordSchema
- resetPasswordSchema

### Middleware (100%)
✅ **auth.ts**
- authenticate()

## Casos de Teste

### 1. Crypto Utils
```typescript
describe('hashPassword', () => {
  ✅ deve gerar hash de senha
  ✅ deve gerar hashes diferentes para mesma senha
});

describe('comparePassword', () => {
  ✅ deve validar senha correta
  ✅ deve rejeitar senha incorreta
  ✅ deve rejeitar senha vazia
});

describe('generateRandomToken', () => {
  ✅ deve gerar token com tamanho padrão (32)
  ✅ deve gerar token com tamanho customizado
  ✅ deve gerar tokens diferentes
  ✅ deve gerar token apenas com caracteres válidos
});
```

### 2. JWT Utils
```typescript
describe('generateTokens', () => {
  ✅ deve gerar access e refresh tokens
  ✅ deve gerar tokens no formato JWT válido
  ✅ deve gerar tokens diferentes
});

describe('verifyAccessToken', () => {
  ✅ deve verificar token válido
  ✅ deve rejeitar token inválido
  ✅ deve rejeitar token com formato inválido
  ✅ deve rejeitar token vazio
  ✅ deve rejeitar token com assinatura inválida
});
```

### 3. Password Reset
```typescript
describe('createPasswordResetToken', () => {
  ✅ deve criar token de reset
  ✅ deve criar tokens diferentes
  ✅ deve invalidar token anterior ao criar novo
});

describe('verifyPasswordResetToken', () => {
  ✅ deve verificar token válido
  ✅ deve retornar null para token inválido
  ✅ deve rejeitar token expirado
  ✅ deve aceitar token antes de expirar
});
```

### 4. Auth Service
```typescript
describe('signup', () => {
  ✅ deve criar usuário com sucesso
  ✅ deve rejeitar email já cadastrado
  ✅ deve rejeitar se partnerEmail for igual ao email
  ✅ deve criar convite se partnerEmail existe
  ✅ não deve criar convite se já existe conexão
});

describe('login', () => {
  ✅ deve fazer login com credenciais válidas
  ✅ deve rejeitar email inexistente
  ✅ deve rejeitar senha incorreta
  ✅ não deve retornar password_hash
});

describe('refresh', () => {
  ✅ deve renovar token com refresh token válido
  ✅ deve rejeitar refresh token inválido
  ✅ deve rejeitar se usuário não existe
});
```

### 5. Auth Schemas
```typescript
describe('signupSchema', () => {
  ✅ deve validar dados corretos
  ✅ deve converter email para lowercase
  ✅ deve rejeitar nome muito curto
  ✅ deve rejeitar email inválido
  ✅ deve rejeitar senha sem maiúscula
  ✅ deve rejeitar senha sem minúscula
  ✅ deve rejeitar senha sem número
  ✅ deve rejeitar senha muito curta
  ✅ deve rejeitar telefone inválido
});
```

### 6. Auth Middleware
```typescript
describe('authenticate', () => {
  ✅ deve autenticar com token válido
  ✅ deve rejeitar sem header de autorização
  ✅ deve rejeitar formato de header inválido
  ✅ deve rejeitar sem Bearer prefix
  ✅ deve rejeitar token inválido
});
```

## Mocking

### Prisma Mock
```typescript
export const mockPrisma = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  connection: {
    create: vi.fn(),
    findFirst: vi.fn(),
  },
};
```

### Service Mock
```typescript
vi.mock('@/services/auth.service');
vi.mocked(authService.login).mockResolvedValue(mockResult);
```

## Boas Práticas

### 1. Isolamento
✅ Cada teste é independente
✅ Mocks são resetados entre testes
✅ Não dependem de ordem de execução

### 2. Nomenclatura Clara
```typescript
describe('Feature', () => {
  it('deve [comportamento esperado]', () => {
    // test
  });
});
```

### 3. AAA Pattern
```typescript
it('deve criar usuário', async () => {
  // Arrange (preparar)
  const input = { name: 'Test', email: 'test@example.com' };
  
  // Act (agir)
  const result = await service.signup(input);
  
  // Assert (verificar)
  expect(result.user.email).toBe('test@example.com');
});
```

### 4. Casos de Borda
✅ Valores válidos
✅ Valores inválidos
✅ Valores nulos/vazios
✅ Valores extremos
✅ Erros esperados

## Cobertura Esperada

```
Statements   : 100%
Branches     : 100%
Functions    : 100%
Lines        : 100%
```

## Exemplos de Execução

### Rodar testes específicos
```bash
# Apenas testes de auth.service
npx vitest src/services/__tests__/auth.service.test.ts

# Apenas testes de utils
npx vitest src/utils/__tests__

# Por pattern
npx vitest --grep "signup"
```

### Ver cobertura
```bash
npm run test:coverage

# Abre relatório HTML
open coverage/index.html
```

### Modo watch
```bash
npm run test:watch

# Comandos interativos:
# a - rodar todos
# f - rodar apenas os que falharam
# p - filtrar por arquivo
# q - sair
```

## CI/CD

Os testes devem ser executados em toda PR:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:coverage
```

## Próximos Passos

- [ ] Testes de integração (E2E)
- [ ] Testes de carga
- [ ] Testes de segurança
- [ ] Mutation testing

## Troubleshooting

### Testes lentos
```bash
# Rodar em paralelo (padrão)
vitest --threads

# Ver tempo de cada teste
vitest --reporter=verbose
```

### Mocks não funcionando
```typescript
// Sempre limpar mocks entre testes
beforeEach(() => {
  vi.clearAllMocks();
});
```

### Timers
```typescript
// Para testar expiração
beforeEach(() => {
  vi.useFakeTimers();
});

vi.advanceTimersByTime(60 * 60 * 1000);
```

---

**Total de Testes: 100+**
**Cobertura: 100%**
**Tempo Médio: < 2 segundos**

