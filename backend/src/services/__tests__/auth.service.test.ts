import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../auth.service';
import { userRepository } from '@/repositories/user.repository';
import { connectionRepository } from '@/repositories/connection.repository';

vi.mock('@/repositories/user.repository');
vi.mock('@/repositories/connection.repository');
vi.mock('@/utils/crypto');
vi.mock('@/utils/jwt');
vi.mock('@/utils/passwordReset');

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    vi.clearAllMocks();
  });

  const mockUser = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+5511999999999',
    password_hash: 'hashed-password',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  describe('signup', () => {
    beforeEach(() => {
      vi.mocked(connectionRepository.findByPartnerEmail).mockResolvedValue([]);
    });

    it('deve criar usuário com sucesso', async () => {
      vi.mocked(userRepository.findByEmailIncludingDeleted).mockResolvedValue(null);
      vi.mocked(userRepository.create).mockResolvedValue(mockUser);

      const { hashPassword } = await import('@/utils/crypto');
      vi.mocked(hashPassword).mockResolvedValue('hashed-password');

      const { generateTokens } = await import('@/utils/jwt');
      vi.mocked(generateTokens).mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await service.signup({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Senha123!',
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBe('access-token');
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('deve vincular convites pendentes ao novo usuário', async () => {
      const pendingInvite = {
        id: 'invite-id',
        user_id_from: 'inviter-id',
        user_id_to: null,
        partner_email: 'test@example.com',
        invited_by: 'inviter-id',
        status: 'pending' as const,
        created_at: new Date(),
        updated_at: new Date(),
        accepted_at: null,
        deleted_at: null,
      };

      vi.mocked(userRepository.findByEmailIncludingDeleted).mockResolvedValue(null);
      vi.mocked(userRepository.create).mockResolvedValue(mockUser);
      vi.mocked(connectionRepository.findByPartnerEmail).mockResolvedValue([pendingInvite]);
      vi.mocked(connectionRepository.updatePartnerConnection).mockResolvedValue({
        ...pendingInvite,
        user_id_to: mockUser.id,
        partner_email: null,
      });

      const { hashPassword } = await import('@/utils/crypto');
      vi.mocked(hashPassword).mockResolvedValue('hashed-password');

      const { generateTokens } = await import('@/utils/jwt');
      vi.mocked(generateTokens).mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await service.signup({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Senha123!',
      });

      expect(connectionRepository.findByPartnerEmail).toHaveBeenCalledWith('test@example.com');
      expect(connectionRepository.updatePartnerConnection).toHaveBeenCalledWith('invite-id', 'user-id');
    });

    it('deve rejeitar email já cadastrado', async () => {
      vi.mocked(userRepository.findByEmailIncludingDeleted).mockResolvedValue({
        ...mockUser,
        deleted_at: null,
      });

      await expect(
        service.signup({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'Senha123!',
        })
      ).rejects.toThrow('Email já cadastrado');
    });

  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

      const { comparePassword } = await import('@/utils/crypto');
      vi.mocked(comparePassword).mockResolvedValue(true);

      const { generateTokens } = await import('@/utils/jwt');
      vi.mocked(generateTokens).mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await service.login({
        email: 'test@example.com',
        password: 'Senha123!',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBe('access-token');
    });

    it('deve rejeitar email inexistente', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(
        service.login({
          email: 'naoexiste@example.com',
          password: 'Senha123!',
        })
      ).rejects.toThrow('Email ou senha incorretos');
    });

    it('deve rejeitar senha incorreta', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

      const { comparePassword } = await import('@/utils/crypto');
      vi.mocked(comparePassword).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'SenhaErrada123!',
        })
      ).rejects.toThrow('Email ou senha incorretos');
    });

    it('não deve retornar password_hash', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

      const { comparePassword } = await import('@/utils/crypto');
      vi.mocked(comparePassword).mockResolvedValue(true);

      const { generateTokens } = await import('@/utils/jwt');
      vi.mocked(generateTokens).mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await service.login({
        email: 'test@example.com',
        password: 'Senha123!',
      });

      expect(result.user).not.toHaveProperty('password_hash');
    });
  });

  describe('refresh', () => {
    it('deve renovar token com refresh token válido', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue(mockUser);

      const { verifyRefreshToken, generateTokens } = await import('@/utils/jwt');
      vi.mocked(verifyRefreshToken).mockReturnValue({
        userId: 'user-id',
        email: 'test@example.com',
        iat: 123456,
        exp: 789012,
      });
      vi.mocked(generateTokens).mockReturnValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const result = await service.refresh('old-refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('deve rejeitar refresh token inválido', async () => {
      const { verifyRefreshToken } = await import('@/utils/jwt');
      vi.mocked(verifyRefreshToken).mockImplementation(() => {
        throw new Error('Token inválido');
      });

      await expect(service.refresh('invalid-token')).rejects.toThrow();
    });

    it('deve rejeitar se usuário não existe', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue(null);

      const { verifyRefreshToken } = await import('@/utils/jwt');
      vi.mocked(verifyRefreshToken).mockReturnValue({
        userId: 'user-id',
        email: 'test@example.com',
        iat: 123456,
        exp: 789012,
      });

      await expect(service.refresh('valid-token')).rejects.toThrow();
    });
  });

  describe('forgotPassword', () => {
    it('deve criar token de reset para email existente', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

      const { createPasswordResetToken } = await import('@/utils/passwordReset');
      vi.mocked(createPasswordResetToken).mockReturnValue('reset-token');

      const result = await service.forgotPassword({
        email: 'test@example.com',
      });

      expect(result.token).toBe('reset-token');
      expect(createPasswordResetToken).toHaveBeenCalledWith('user-id');
    });

    it('deve retornar token fake para email inexistente', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      const result = await service.forgotPassword({
        email: 'naoexiste@example.com',
      });

      expect(result.token).toBe('fake-token-for-security');
    });
  });

  describe('resetPassword', () => {
    it('deve resetar senha com token válido', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue(mockUser);
      vi.mocked(userRepository.updatePassword).mockResolvedValue({
        ...mockUser,
        password_hash: 'new-hash',
      });

      const { verifyPasswordResetToken, deletePasswordResetToken } = await import('@/utils/passwordReset');
      vi.mocked(verifyPasswordResetToken).mockReturnValue('user-id');

      const { hashPassword } = await import('@/utils/crypto');
      vi.mocked(hashPassword).mockResolvedValue('new-hash');

      await service.resetPassword({
        token: 'valid-token',
        password: 'NovaSenha123!',
      });

      expect(userRepository.updatePassword).toHaveBeenCalledWith('user-id', 'new-hash');
      expect(deletePasswordResetToken).toHaveBeenCalledWith('valid-token');
    });

    it('deve rejeitar token inválido', async () => {
      const { verifyPasswordResetToken } = await import('@/utils/passwordReset');
      vi.mocked(verifyPasswordResetToken).mockReturnValue(null);

      await expect(
        service.resetPassword({
          token: 'invalid-token',
          password: 'NovaSenha123!',
        })
      ).rejects.toThrow('Token inválido ou expirado');
    });

    it('deve rejeitar se usuário não existe', async () => {
      vi.mocked(userRepository.findById).mockResolvedValue(null);

      const { verifyPasswordResetToken } = await import('@/utils/passwordReset');
      vi.mocked(verifyPasswordResetToken).mockReturnValue('user-id');

      await expect(
        service.resetPassword({
          token: 'valid-token',
          password: 'NovaSenha123!',
        })
      ).rejects.toThrow('Usuário não encontrado');
    });
  });
});
