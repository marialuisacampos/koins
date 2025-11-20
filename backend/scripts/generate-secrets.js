import crypto from 'crypto';

console.log('\n🔐 Secrets gerados para JWT:\n');
console.log('JWT_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));
console.log('\nJWT_REFRESH_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));
console.log('\n⚠️  Copie esses valores para o seu arquivo .env\n');

