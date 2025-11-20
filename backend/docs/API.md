# API Documentation - Koins Backend

Base URL: `http://localhost:3000`

## Autenticação

Todas as rotas protegidas requerem o header:
```
Authorization: Bearer <access_token>
```

---

## Rotas Públicas

### Health Check

**GET** `/health`

Verifica o status do servidor.

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T12:00:00.000Z",
  "environment": "development"
}
```

---

## Auth Routes

Base: `/api/auth`

### 1. Cadastro (Signup)

**POST** `/api/auth/signup`

Cria um novo usuário e opcionalmente envia convite de conexão.

**Request Body:**
```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "phone": "+5511999999999",
  "password": "Senha123!",
  "partnerEmail": "joao@example.com"
}
```

**Validações:**
- `name`: 2-100 caracteres
- `email`: email válido
- `phone`: formato internacional (opcional)
- `password`: 
  - Mínimo 8 caracteres
  - Ao menos 1 maiúscula
  - Ao menos 1 minúscula
  - Ao menos 1 número
- `partnerEmail`: email válido (opcional)

**Response 201:**
```json
{
  "status": "success",
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Maria Silva",
      "email": "maria@example.com",
      "phone": "+5511999999999",
      "created_at": "2025-11-15T12:00:00.000Z",
      "updated_at": "2025-11-15T12:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

**Errors:**
- `409`: Email já cadastrado
- `400`: Email do parceiro não pode ser o mesmo
- `422`: Erro de validação

---

### 2. Login

**POST** `/api/auth/login`

Autentica um usuário existente.

**Request Body:**
```json
{
  "email": "maria@example.com",
  "password": "Senha123!"
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Maria Silva",
      "email": "maria@example.com",
      "phone": "+5511999999999",
      "created_at": "2025-11-15T12:00:00.000Z",
      "updated_at": "2025-11-15T12:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

**Errors:**
- `401`: Email ou senha incorretos

---

### 3. Refresh Token

**POST** `/api/auth/refresh`

Atualiza o access token usando um refresh token válido.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Token atualizado com sucesso",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

**Errors:**
- `401`: Refresh token inválido ou expirado

---

### 4. Esqueci a Senha

**POST** `/api/auth/forgot-password`

Solicita um token para resetar a senha.

**Request Body:**
```json
{
  "email": "maria@example.com"
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Se o email existir, você receberá um link para recuperação de senha",
  "data": {
    "token": "random-token-64-chars"
  }
}
```

**Nota:**
- Por segurança, sempre retorna sucesso mesmo se o email não existir
- O token tem validade de 1 hora
- Na produção, enviar por email (não retornar no response)

---

### 5. Resetar Senha

**POST** `/api/auth/reset-password`

Reseta a senha usando o token recebido.

**Request Body:**
```json
{
  "token": "random-token-64-chars",
  "password": "NovaSenha123!"
}
```

**Validações:**
- `password`: mesmas validações do signup

**Response 200:**
```json
{
  "status": "success",
  "message": "Senha alterada com sucesso"
}
```

**Errors:**
- `400`: Token inválido ou expirado
- `404`: Usuário não encontrado

---

### 6. Logout

**POST** `/api/auth/logout`

Realiza o logout do usuário.

**Response 200:**
```json
{
  "status": "success",
  "message": "Logout realizado com sucesso"
}
```

**Nota:**
- No frontend, remover tokens do localStorage/cookies
- Tokens JWT são stateless, logout é apenas no cliente

---

## Códigos de Status

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida
- `401`: Não autorizado
- `403`: Acesso negado
- `404`: Recurso não encontrado
- `409`: Conflito (ex: email já existe)
- `422`: Erro de validação
- `429`: Muitas requisições (rate limit)
- `500`: Erro interno do servidor

---

## Formato de Erro

Todos os erros seguem este formato:

```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

Erros de validação (422):
```json
{
  "status": "error",
  "message": "Erro de validação",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "Senha deve ter no mínimo 8 caracteres"
    }
  ]
}
```

---

## Tokens JWT

### Access Token
- Duração: 15 minutos (configurável)
- Uso: Todas as requisições autenticadas
- Header: `Authorization: Bearer <token>`

### Refresh Token
- Duração: 7 dias (configurável)
- Uso: Renovar access token
- Guardar com segurança no cliente

### Payload do Token
```json
{
  "userId": "uuid",
  "email": "maria@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Rate Limiting

- **Limite:** 100 requisições por minuto por IP
- **Response 429:**
```json
{
  "status": "error",
  "message": "Muitas requisições. Tente novamente em alguns instantes."
}
```

---

## Exemplos de Uso

### Fluxo Completo de Autenticação

```bash
# 1. Cadastro
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "Senha123!",
    "partnerEmail": "joao@example.com"
  }'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "Senha123!"
  }'

# 3. Usar o access token em rotas protegidas
curl -X GET http://localhost:3000/api/protected-route \
  -H "Authorization: Bearer eyJhbGc..."

# 4. Quando o token expirar, renovar
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGc..."
  }'

# 5. Esqueci a senha
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com"
  }'

# 6. Resetar senha
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token-recebido",
    "password": "NovaSenha123!"
  }'
```

---

## Próximas Rotas (Em Desenvolvimento)

- `/api/connections` - Gerenciar conexões entre pares
- `/api/expenses` - CRUD de despesas
- `/api/subscriptions` - Gerenciar assinaturas
- `/api/users/me` - Perfil do usuário
- `/api/users/change-password` - Trocar senha (autenticado)

