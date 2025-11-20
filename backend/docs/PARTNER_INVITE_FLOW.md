# Fluxo de Convite de Parceiros - Koins

## Visão Geral

O sistema suporta convites para parceiros que ainda não possuem conta. Quando um usuário se cadastra informando o email de um parceiro que não existe, o sistema cria um convite pendente que será automaticamente vinculado quando o parceiro se cadastrar.

## Cenários de Uso

### Cenário 1: Parceiro já tem conta

**Fluxo:**
1. Usuário A se cadastra com `partnerEmail: "joao@example.com"`
2. Sistema verifica que João já está cadastrado
3. Cria `Connection` normal:
   ```json
   {
     "user_id_from": "maria-id",
     "user_id_to": "joao-id",
     "partner_email": null,
     "status": "pending"
   }
   ```
4. João vê o convite pendente no dashboard
5. João pode aceitar/rejeitar o convite

### Cenário 2: Parceiro não tem conta (novo)

**Fluxo:**
1. Usuário A (Maria) se cadastra com `partnerEmail: "joao@example.com"`
2. Sistema verifica que João NÃO está cadastrado
3. Cria `Connection` com email pendente:
   ```json
   {
     "user_id_from": "maria-id",
     "user_id_to": null,
     "partner_email": "joao@example.com",
     "status": "pending"
   }
   ```
4. Quando João se cadastrar:
   - Sistema busca connections com `partner_email = joao@example.com`
   - Atualiza a connection:
     ```json
     {
       "user_id_from": "maria-id",
       "user_id_to": "joao-id",
       "partner_email": null,
       "status": "pending"
     }
     ```
5. João vê o convite pendente no dashboard
6. João pode aceitar/rejeitar

### Cenário 3: Múltiplos convites para o mesmo email

Se Maria e Carlos convidarem João antes dele se cadastrar:

1. Maria se cadastra com `partnerEmail: "joao@example.com"` → Connection 1 criada
2. Carlos se cadastra com `partnerEmail: "joao@example.com"` → Connection 2 criada
3. Quando João se cadastrar:
   - Sistema encontra 2 connections pendentes
   - Atualiza ambas com `user_id_to: joao-id`
   - João vê 2 convites pendentes no dashboard

## Modelo de Dados

### Connection (Atualizado)

```prisma
model Connection {
  id            String   @id @default(uuid())
  user_id_from  String
  user_id_to    String?           // ← Opcional agora
  partner_email String?           // ← Novo campo
  invited_by    String
  status        ConnectionStatus @default(pending)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  accepted_at   DateTime?
  deleted_at    DateTime?

  user_from User?  @relation("ConnectionFrom", ...)
  user_to   User?  @relation("ConnectionTo", ...)  // ← Opcional
  expenses  Expense[]

  @@index([partner_email])  // ← Novo índice
}
```

### Estados da Connection

1. **Convite normal (ambos usuários existem)**
   - `user_id_from`: ID do usuário que enviou
   - `user_id_to`: ID do usuário convidado
   - `partner_email`: null
   - `status`: "pending"

2. **Convite pendente (parceiro não cadastrado)**
   - `user_id_from`: ID do usuário que enviou
   - `user_id_to`: null
   - `partner_email`: email do parceiro
   - `status`: "pending"

3. **Convite vinculado (parceiro se cadastrou)**
   - `user_id_from`: ID do usuário que enviou
   - `user_id_to`: ID do parceiro (agora preenchido)
   - `partner_email`: null (limpo)
   - `status`: "pending"

4. **Conexão ativa**
   - `user_id_from`: ID do usuário que enviou
   - `user_id_to`: ID do parceiro
   - `partner_email`: null
   - `status`: "accepted"

## API Endpoints

### POST /api/auth/signup

**Request:**
```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "Senha123!",
  "partnerEmail": "joao@example.com"  // opcional
}
```

**Comportamento:**
- Se `partnerEmail` fornecido e usuário existe → cria connection normal
- Se `partnerEmail` fornecido e usuário NÃO existe → cria connection com `partner_email`
- Se há convites pendentes para o email do novo usuário → vincula automaticamente

**Response:**
```json
{
  "status": "success",
  "message": "Usuário criado com sucesso",
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

## Queries e Métodos

### ConnectionRepository

```typescript
// Criar connection (normal ou com email)
create({
  user_id_from: string,
  user_id_to?: string | null,
  partner_email?: string | null,
  invited_by: string,
  status: ConnectionStatus
})

// Buscar convites pendentes por email
findByPartnerEmail(email: string): Promise<Connection[]>

// Vincular usuário a convite pendente
updatePartnerConnection(connectionId: string, userId: string): Promise<Connection>
```

## Logs

### Convite com email (parceiro não cadastrado)
```
Connection invite created with partner email (user not registered yet)
{
  from: "maria-id",
  partnerEmail: "joao@example.com"
}
```

### Vinculação automática (parceiro se cadastrou)
```
Pending invite linked to new user
{
  connectionId: "connection-id",
  userId: "joao-id",
  inviterId: "maria-id"
}
```

## Considerações de Segurança

1. **Validação de Email**: O `partnerEmail` deve ser um email válido
2. **Não pode ser o mesmo email**: Usuário não pode convidar a si mesmo
3. **Múltiplos convites**: Sistema suporta múltiplos usuários convidando o mesmo email
4. **Privacidade**: Usuário não cadastrado não aparece como "usuário" até se cadastrar
5. **Limpeza**: `partner_email` é limpo após vinculação (não fica duplicado)

## Exemplos de Queries

### Buscar convites pendentes para um email
```typescript
const invites = await connectionRepository.findByPartnerEmail('joao@example.com');
// Retorna todas connections com partner_email = 'joao@example.com' e user_id_to = null
```

### Vincular usuário aos convites
```typescript
for (const invite of invites) {
  await connectionRepository.updatePartnerConnection(invite.id, newUserId);
}
```

### Verificar se convite já existe
```typescript
const existing = await connectionRepository.findByUsers(userId1, userId2);
if (existing) {
  // Já existe connection
}
```

## Dashboard - Estados de Conexão

### Para Maria (enviou convite):
- **Antes de João se cadastrar**: "Convite enviado para joao@example.com"
- **Depois de João se cadastrar**: "Aguardando João aceitar o convite"
- **Depois de João aceitar**: "Conectado com João"

### Para João (recebeu convite):
- **Ao se cadastrar**: Automaticamente vê "Você tem um convite pendente de Maria"
- **Pode aceitar ou rejeitar**: Decide se quer se conectar

## Migrações

A migration adiciona:
- Campo `partner_email` (nullable)
- Modifica `user_id_to` para nullable
- Adiciona índice em `partner_email`
- Remove constraint unique `[user_id_from, user_id_to]` (já que `user_id_to` pode ser null)

## Testes

114 testes implementados, incluindo:
- Criação de connection com `partner_email`
- Busca de convites por email
- Vinculação automática ao cadastro
- Múltiplos convites para o mesmo email
- Validações de email duplicado

## Benefícios

✅ Usuário pode convidar alguém que ainda não tem conta
✅ Convite não se perde
✅ Vinculação automática ao cadastro
✅ Suporta múltiplos convites para o mesmo email
✅ Experiência fluida para ambos os usuários
✅ Sem dados duplicados após vinculação

