import crypto from 'crypto';
import { JWTPayload, AuthTokens } from '@/types';
import { UnauthorizedError } from './errors';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '90d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured. Check your .env file.');
}

function parseExpiration(exp: string): number {
  const unit = exp.slice(-1);
  const value = parseInt(exp.slice(0, -1), 10);

  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (units[unit] || 1000);
}

function createToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  secret: string,
  expiresIn: string
): string {
  const now = Date.now();
  const exp = now + parseExpiration(expiresIn);

  const fullPayload: JWTPayload = {
    ...payload,
    iat: Math.floor(now / 1000),
    exp: Math.floor(exp / 1000),
  };

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token: string, secret: string): JWTPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new UnauthorizedError('Token inválido');
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (signature !== expectedSignature) {
    throw new UnauthorizedError('Token inválido');
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new UnauthorizedError('Token expirado');
  }

  return payload;
}

export function generateTokens(userId: string, email: string): AuthTokens {
  const payload = { userId, email };

  return {
    accessToken: createToken(payload, JWT_SECRET, JWT_EXPIRES_IN),
    refreshToken: createToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN),
  };
}

export function verifyAccessToken(token: string): JWTPayload {
  return verifyToken(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string): JWTPayload {
  return verifyToken(token, JWT_REFRESH_SECRET);
}

