#!/bin/bash

if [ -f .env ]; then
    echo "⚠️  Arquivo .env já existe. Não será sobrescrito."
    exit 0
fi

cat > .env << 'EOF'
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

JWT_SECRET="CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_MIN_64_CHARS"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="CHANGE_THIS_TO_ANOTHER_SECURE_RANDOM_STRING_MIN_64_CHARS"
JWT_REFRESH_EXPIRES_IN="7d"

PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

BCRYPT_ROUNDS=12

RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
EOF

echo "✅ Arquivo .env criado com sucesso!"
echo "⚠️  IMPORTANTE: Edite o arquivo .env e configure:"
echo "   - DATABASE_URL com suas credenciais do Supabase"
echo "   - JWT_SECRET e JWT_REFRESH_SECRET com valores seguros"
echo ""
echo "Para gerar secrets seguros, execute:"
echo "  node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""

