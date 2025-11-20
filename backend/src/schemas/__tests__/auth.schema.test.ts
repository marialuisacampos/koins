import { describe, it, expect } from 'vitest';
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../auth.schema';

describe('Auth Schemas', () => {
  describe('signupSchema', () => {
    it('deve validar dados corretos', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Senha123!',
      };

      const result = signupSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('deve validar com telefone e partnerEmail', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+5511999999999',
        password: 'Senha123!',
        partnerEmail: 'partner@example.com',
      };

      const result = signupSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('deve converter email para lowercase', () => {
      const data = {
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'Senha123!',
      };

      const result = signupSchema.parse(data);

      expect(result.email).toBe('test@example.com');
    });

    it('deve rejeitar nome muito curto', () => {
      const data = {
        name: 'T',
        email: 'test@example.com',
        password: 'Senha123!',
      };

      expect(() => signupSchema.parse(data)).toThrow();
    });

    it('deve rejeitar email inválido', () => {
      const data = {
        name: 'Test User',
        email: 'email-invalido',
        password: 'Senha123!',
      };

      expect(() => signupSchema.parse(data)).toThrow();
    });

    it('deve rejeitar senha sem maiúscula', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'senha123!',
      };

      expect(() => signupSchema.parse(data)).toThrow();
    });

    it('deve rejeitar senha sem minúscula', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SENHA123!',
      };

      expect(() => signupSchema.parse(data)).toThrow();
    });

    it('deve rejeitar senha sem número', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SenhaAbc!',
      };

      expect(() => signupSchema.parse(data)).toThrow();
    });

    it('deve rejeitar senha muito curta', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Sen1!',
      };

      expect(() => signupSchema.parse(data)).toThrow();
    });

    it('deve rejeitar telefone inválido', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123',
        password: 'Senha123!',
      };

      expect(() => signupSchema.parse(data)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('deve validar dados corretos', () => {
      const data = {
        email: 'test@example.com',
        password: 'Senha123!',
      };

      const result = loginSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('deve converter email para lowercase', () => {
      const data = {
        email: 'TEST@EXAMPLE.COM',
        password: 'Senha123!',
      };

      const result = loginSchema.parse(data);

      expect(result.email).toBe('test@example.com');
    });

    it('deve rejeitar email inválido', () => {
      const data = {
        email: 'email-invalido',
        password: 'Senha123!',
      };

      expect(() => loginSchema.parse(data)).toThrow();
    });

    it('deve rejeitar senha vazia', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      };

      expect(() => loginSchema.parse(data)).toThrow();
    });
  });

  describe('refreshTokenSchema', () => {
    it('deve validar refresh token', () => {
      const data = {
        refreshToken: 'valid-token',
      };

      const result = refreshTokenSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('deve rejeitar token vazio', () => {
      const data = {
        refreshToken: '',
      };

      expect(() => refreshTokenSchema.parse(data)).toThrow();
    });
  });

  describe('forgotPasswordSchema', () => {
    it('deve validar email', () => {
      const data = {
        email: 'test@example.com',
      };

      const result = forgotPasswordSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('deve converter email para lowercase', () => {
      const data = {
        email: 'TEST@EXAMPLE.COM',
      };

      const result = forgotPasswordSchema.parse(data);

      expect(result.email).toBe('test@example.com');
    });

    it('deve rejeitar email inválido', () => {
      const data = {
        email: 'email-invalido',
      };

      expect(() => forgotPasswordSchema.parse(data)).toThrow();
    });
  });

  describe('resetPasswordSchema', () => {
    it('deve validar dados corretos', () => {
      const data = {
        token: 'reset-token',
        password: 'NovaSenha123!',
      };

      const result = resetPasswordSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('deve rejeitar token vazio', () => {
      const data = {
        token: '',
        password: 'NovaSenha123!',
      };

      expect(() => resetPasswordSchema.parse(data)).toThrow();
    });

    it('deve validar requisitos de senha', () => {
      const data = {
        token: 'reset-token',
        password: 'senha',
      };

      expect(() => resetPasswordSchema.parse(data)).toThrow();
    });
  });
});

