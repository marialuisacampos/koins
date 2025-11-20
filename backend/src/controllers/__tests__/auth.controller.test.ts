import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthController } from '../auth.controller';
import { authService } from '@/services/auth.service';

vi.mock('@/services/auth.service');

describe('AuthController', () => {
  let controller: AuthController;
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    controller = new AuthController();
    mockRequest = {
      body: {},
    };
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe('signup', () => {
    it('deve criar usuário e retornar 201', async () => {
      const mockResult = {
        user: {
          id: 'user-id',
          name: 'Test User',
          email: 'test@example.com',
          phone: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };

      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Senha123!',
      };

      vi.mocked(authService.signup).mockResolvedValue(mockResult);

      await controller.signup(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Usuário criado com sucesso',
        data: mockResult,
      });
    });
  });

  describe('login', () => {
    it('deve fazer login e retornar 200', async () => {
      const mockResult = {
        user: {
          id: 'user-id',
          name: 'Test User',
          email: 'test@example.com',
          phone: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'Senha123!',
      };

      vi.mocked(authService.login).mockResolvedValue(mockResult);

      await controller.login(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Login realizado com sucesso',
        data: mockResult,
      });
    });
  });

  describe('refresh', () => {
    it('deve renovar token e retornar 200', async () => {
      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockRequest.body = {
        refreshToken: 'old-refresh-token',
      };

      vi.mocked(authService.refresh).mockResolvedValue(mockTokens);

      await controller.refresh(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Token atualizado com sucesso',
        data: { tokens: mockTokens },
      });
    });
  });

  describe('forgotPassword', () => {
    it('deve criar token de reset e retornar 200', async () => {
      mockRequest.body = {
        email: 'test@example.com',
      };

      vi.mocked(authService.forgotPassword).mockResolvedValue({
        token: 'reset-token',
      });

      await controller.forgotPassword(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Se o email existir, você receberá um link para recuperação de senha',
        data: { token: 'reset-token' },
      });
    });
  });

  describe('resetPassword', () => {
    it('deve resetar senha e retornar 200', async () => {
      mockRequest.body = {
        token: 'reset-token',
        password: 'NovaSenha123!',
      };

      vi.mocked(authService.resetPassword).mockResolvedValue(undefined);

      await controller.resetPassword(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Senha alterada com sucesso',
      });
    });
  });

  describe('logout', () => {
    it('deve fazer logout e retornar 200', async () => {
      await controller.logout(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Logout realizado com sucesso',
      });
    });
  });
});

