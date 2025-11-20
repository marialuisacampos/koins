import { describe, it, expect, beforeAll } from 'vitest';
import { hashPassword, comparePassword, generateRandomToken } from '../crypto';

describe('Crypto Utils', () => {
  beforeAll(() => {
    process.env.BCRYPT_ROUNDS = '10';
  });

  describe('hashPassword', () => {
    it('deve gerar hash de senha', async () => {
      const password = 'Senha123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('deve gerar hashes diferentes para mesma senha', async () => {
      const password = 'Senha123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('deve validar senha correta', async () => {
      const password = 'Senha123!';
      const hash = await hashPassword(password);
      const isValid = await comparePassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('deve rejeitar senha incorreta', async () => {
      const password = 'Senha123!';
      const wrongPassword = 'SenhaErrada123!';
      const hash = await hashPassword(password);
      const isValid = await comparePassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it('deve rejeitar senha vazia', async () => {
      const password = 'Senha123!';
      const hash = await hashPassword(password);
      const isValid = await comparePassword('', hash);

      expect(isValid).toBe(false);
    });
  });

  describe('generateRandomToken', () => {
    it('deve gerar token com tamanho padrão (32)', () => {
      const token = generateRandomToken();

      expect(token).toBeDefined();
      expect(token.length).toBe(32);
    });

    it('deve gerar token com tamanho customizado', () => {
      const token = generateRandomToken(64);

      expect(token).toBeDefined();
      expect(token.length).toBe(64);
    });

    it('deve gerar tokens diferentes', () => {
      const token1 = generateRandomToken();
      const token2 = generateRandomToken();

      expect(token1).not.toBe(token2);
    });

    it('deve gerar token apenas com caracteres válidos', () => {
      const token = generateRandomToken();
      const validChars = /^[A-Za-z0-9]+$/;

      expect(token).toMatch(validChars);
    });
  });
});

