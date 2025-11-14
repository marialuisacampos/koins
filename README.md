# Koins

**Equilíbrio financeiro a dois**

## Descrição

Koins é um aplicativo PWA (Progressive Web App) desenvolvido para ajudar casais a gerenciar suas finanças juntos de forma simples e eficiente.

## Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool moderna e rápida
- **SCSS** - Pré-processador CSS com variáveis, mixins e nesting
- **CSS Modules** - Estilização modular e encapsulada
- **React Router v6** - Navegação entre páginas
- **Lucide React** - Biblioteca moderna de ícones
- **PWA** - Progressive Web App com suporte offline

## Estrutura do Projeto

```
koins/
├── public/              # Arquivos estáticos e ícones PWA
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   └── Logo/
│   ├── pages/           # Páginas da aplicação
│   │   ├── Login/
│   │   ├── SignUp/
│   │   └── ForgotPassword/
│   ├── styles/          # Estilos globais, variáveis e mixins SCSS
│   │   ├── global.scss
│   │   ├── variables.scss
│   │   └── mixins.scss
│   ├── App.tsx          # Componente principal e rotas
│   └── main.tsx         # Ponto de entrada
├── index.html
├── package.json
└── vite.config.ts
```

## Design System

O projeto utiliza um sistema de design consistente com variáveis SCSS centralizadas em `src/styles/variables.scss`:

### Cores

- **Primary**: `$color-primary` (#FF6B35) - Laranja elegante
- **Background**: `$color-background` (#FFFFFF) - Branco
- **Surface**: `$color-surface` (#FAFAFA) - Cinza claro
- **Text Primary**: `$color-text-primary` (#1A1A1A) - Preto quase
- **Text Secondary**: `$color-text-secondary` (#6B6B6B) - Cinza médio

### Espaçamento

- `$spacing-xs`: 4px
- `$spacing-sm`: 8px
- `$spacing-md`: 16px
- `$spacing-lg`: 24px
- `$spacing-xl`: 32px
- `$spacing-xxl`: 48px

### Border Radius

- `$radius-sm`: 8px
- `$radius-md`: 12px
- `$radius-lg`: 16px
- `$radius-xl`: 24px
- `$radius-full`: 9999px

### Mixins SCSS

O projeto inclui mixins úteis em `src/styles/mixins.scss`:

- `@mixin flex-center` - Centralização com flexbox
- `@mixin hover-lift` - Efeito de elevação no hover
- `@mixin focus-ring` - Anel de foco acessível
- `@mixin gradient-bg` - Gradiente de fundo padrão
- E mais...

## Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

## PWA

O aplicativo é configurado como PWA e inclui:

- Service Worker para cache e funcionamento offline
- Manifest para instalação no dispositivo
- Ícones otimizados para diferentes plataformas
- Tema adaptável ao sistema

## Rotas

O aplicativo possui as seguintes rotas configuradas:

- `/` - Redireciona automaticamente para `/dashboard`
- `/login` - Página de login
- `/cadastro` - Página de cadastro de nova conta
- `/recuperar-senha` - Página de recuperação de senha
- `/dashboard` - Página principal do aplicativo (após login)

## Funcionalidades

### Página de Login ✅

- Formulário de autenticação
- Validação de email e senha
- Design responsivo mobile-first
- Animações suaves
- Estados de loading
- Navegação para cadastro e recuperação de senha

### Página de Cadastro ✅

- Formulário completo de registro
- Campo de nome personalizado
- Validação de email, celular e senha
- Máscara automática de celular
- Campo opcional para conectar com email do parceiro
- Validações em tempo real

### Página de Recuperação de Senha ✅

- Formulário de recuperação simples
- Validação de email
- Tela de confirmação de envio
- Opção de reenvio
- Navegação de retorno ao login

### Dashboard Principal ✅

**3 Estados Diferentes:**

1. **Sem Conexão (Sem Solicitação)**
   - Estado vazio com ícone ilustrativo
   - Formulário para enviar convite ao parceiro
   - Design clean e direto

2. **Solicitação Pendente**
   - Card destacado com informações do solicitante
   - Opções para aceitar ou recusar
   - Design amigável e convidativo

3. **Conectado (Dashboard Completo)**
   - Card de balanço com gradiente laranja
   - Indicação visual de quem deve para quem
   - Lista de despesas (extrato)
   - Botão flutuante para adicionar despesa

**Componentes Criados:**
- Header com logo, configurações e logout
- BalanceCard - Mostra o saldo entre o casal
- ExpenseItem - Item individual de despesa
- FloatingButton - Botão destacado no footer
- EmptyState - Estado vazio reutilizável

## Próximos Passos

- [ ] Implementar autenticação real com backend
- [ ] Tela de adicionar/editar despesa
- [ ] Tela de configurações
- [ ] Sistema real de conexão entre pares
- [ ] Página de extrato completo
- [ ] Relatórios e gráficos financeiros
- [ ] Notificações push
- [ ] Sistema de categorias de despesas
