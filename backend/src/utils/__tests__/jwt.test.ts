import { describe, it, expect, beforeAll } from 'vitest';
import { generateTokens, verifyAccessToken, verifyRefreshToken } from '../jwt';

describe('JWT Utils', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret-min-64-chars-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-64-chars-bbbbbbbbbbbbbbbbbbbbbbbbbbbb';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
  });

  const userId = 'test-user-id';
  const email = 'test@example.com';

  describe('generateTokens', () => {
    it('deve gerar access e refresh tokens', () => {
      const tokens = generateTokens(userId, email);

      expect(tokens).toBeDefined();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });

    it('deve gerar tokens no formato JWT válido', () => {
      const tokens = generateTokens(userId, email);
      const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

      expect(tokens.accessToken).toMatch(jwtRegex);
      expect(tokens.refreshToken).toMatch(jwtRegex);
    });

    it('deve gerar tokens únicos para diferentes usuários', () => {
      const tokens1 = generateTokens('user-1', 'user1@example.com');
      const tokens2 = generateTokens('user-2', 'user2@example.com');

      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('deve verificar token válido', () => {
      const tokens = generateTokens(userId, email);
      const payload = verifyAccessToken(tokens.accessToken);

      expect(payload).toBeDefined();
      expect(payload.userId).toBe(userId);
      expect(payload.email).toBe(email);
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });

    it('deve rejeitar token inválido', () => {
      expect(() => verifyAccessToken('token-invalido')).toThrow('Token inválido');
    });

    it('deve rejeitar token com formato inválido', () => {
      expect(() => verifyAccessToken('abc.def')).toThrow('Token inválido');
    });

    it('deve rejeitar token vazio', () => {
      expect(() => verifyAccessToken('')).toThrow('Token inválido');
    });

    it('deve rejeitar token com assinatura inválida', () => {
      const tokens = generateTokens(userId, email);
      const [header, payload] = tokens.accessToken.split('.');
      const invalidToken = `${header}.${payload}.invalid-signature`;

      expect(() => verifyAccessToken(invalidToken)).toThrow('Token inválido');
    });
  });

  describe('verifyRefreshToken', () => {
    it('deve verificar refresh token válido', () => {
      const tokens = generateTokens(userId, email);
      const payload = verifyRefreshToken(tokens.refreshToken);

      expect(payload).toBeDefined();
      expect(payload.userId).toBe(userId);
      expect(payload.email).toBe(email);
    });

    it('deve rejeitar refresh token inválido', () => {
      expect(() => verifyRefreshToken('token-invalido')).toThrow('Token inválido');
    });

    it('não deve aceitar access token como refresh token', () => {
      const tokens = generateTokens(userId, email);

      expect(() => verifyRefreshToken(tokens.accessToken)).toThrow('Token inválido');
    });
  });

  describe('Token Expiration', () => {
    it('payload deve conter iat e exp', () => {
      const tokens = generateTokens(userId, email);
      const payload = verifyAccessToken(tokens.accessToken);

      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
      expect(payload.exp).toBeGreaterThan(payload.iat!);
    });

    it('exp deve ser maior que iat', () => {
      const tokens = generateTokens(userId, email);
      const payload = verifyAccessToken(tokens.accessToken);

      expect(payload.exp).toBeGreaterThan(payload.iat!);
    });
  });
});
