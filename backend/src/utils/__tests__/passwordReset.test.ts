import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createPasswordResetToken,
  verifyPasswordResetToken,
  deletePasswordResetToken,
} from '../passwordReset';

describe('Password Reset Utils', () => {
  const userId = 'test-user-id';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('createPasswordResetToken', () => {
    it('deve criar token de reset', () => {
      const token = createPasswordResetToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64);
    });

    it('deve criar tokens diferentes', () => {
      const token1 = createPasswordResetToken(userId);
      const token2 = createPasswordResetToken('another-user');

      expect(token1).not.toBe(token2);
    });

    it('deve invalidar token anterior ao criar novo para mesmo usuário', () => {
      const token1 = createPasswordResetToken(userId);
      const token2 = createPasswordResetToken(userId);

      expect(verifyPasswordResetToken(token1)).toBeNull();
      expect(verifyPasswordResetToken(token2)).toBe(userId);
    });
  });

  describe('verifyPasswordResetToken', () => {
    it('deve verificar token válido', () => {
      const token = createPasswordResetToken(userId);
      const result = verifyPasswordResetToken(token);

      expect(result).toBe(userId);
    });

    it('deve retornar null para token inválido', () => {
      const result = verifyPasswordResetToken('token-invalido');

      expect(result).toBeNull();
    });

    it('deve rejeitar token expirado', () => {
      const token = createPasswordResetToken(userId);

      vi.advanceTimersByTime(61 * 60 * 1000);

      const result = verifyPasswordResetToken(token);

      expect(result).toBeNull();
    });

    it('deve aceitar token antes de expirar', () => {
      const token = createPasswordResetToken(userId);

      vi.advanceTimersByTime(59 * 60 * 1000);

      const result = verifyPasswordResetToken(token);

      expect(result).toBe(userId);
    });
  });

  describe('deletePasswordResetToken', () => {
    it('deve deletar token existente', () => {
      const token = createPasswordResetToken(userId);

      expect(verifyPasswordResetToken(token)).toBe(userId);

      deletePasswordResetToken(token);

      expect(verifyPasswordResetToken(token)).toBeNull();
    });

    it('não deve lançar erro ao deletar token inexistente', () => {
      expect(() => deletePasswordResetToken('token-inexistente')).not.toThrow();
    });
  });
});

