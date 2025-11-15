# Guia de Início Rápido - Koins

## Primeira vez rodando o projeto?

### 1. Instalar todas as dependências

```bash
# Na raiz do projeto
npm run install:all
```

Isso irá instalar:
- Dependências da raiz (concurrently)
- Dependências do PWA (React, Vite, etc.)
- Dependências do Backend (Fastify, etc.)

### 2. Configurar variáveis de ambiente (Backend)

```bash
cd backend
cp .env.example .env
# Edite o .env se necessário
cd ..
```

### 3. Rodar o projeto completo

```bash
# Roda PWA e Backend simultaneamente
npm run dev
```

Isso abrirá:
- **PWA**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Comandos Úteis

### Desenvolvimento

```bash
# Rodar tudo junto
npm run dev

# Rodar apenas o PWA
npm run dev:pwa

# Rodar apenas o Backend
npm run dev:backend
```

### Build

```bash
# Build de tudo
npm run build

# Build apenas PWA
npm run build:pwa

# Build apenas Backend
npm run build:backend
```

### Lint

```bash
# Lint em tudo
npm run lint
```

## Estrutura do Projeto

```
koins/
├── pwa/           # Aplicativo PWA (React)
│   └── src/       # Código fonte do app
├── backend/       # API Backend (Fastify)
│   └── src/       # Código fonte da API
├── landing/       # Landing Page (vazio)
└── package.json   # Scripts principais
```

## Próximos Passos

1. ✅ PWA funcionando
2. ✅ Backend estrutura básica
3. 🚧 Configurar banco de dados no backend
4. 🚧 Criar rotas da API
5. 🚧 Conectar PWA com Backend
6. 🚧 Criar Landing Page

## Troubleshooting

### Porta já em uso

Se as portas 5173 ou 3000 já estiverem em uso:

```bash
# Matar processos nas portas
# Mac/Linux:
lsof -ti:5173 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Problemas com dependências

```bash
# Limpar tudo e reinstalar
rm -rf node_modules pwa/node_modules backend/node_modules
npm run install:all
```

### Backend não inicia

Verifique se:
1. Copiou o `.env.example` para `.env` na pasta backend
2. As dependências foram instaladas corretamente
3. A porta 3000 está disponível

## Dúvidas?

Consulte os READMEs específicos:
- [README Principal](./README.md)
- [README Backend](./backend/README.md)

