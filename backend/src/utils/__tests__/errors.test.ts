import { describe, it, expect } from 'vitest';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('deve criar erro com mensagem e status code', () => {
      const error = new AppError('Erro teste', 500);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Erro teste');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('deve ter stack trace', () => {
      const error = new AppError('Erro teste', 500);

      expect(error.stack).toBeDefined();
    });
  });

  describe('BadRequestError', () => {
    it('deve ter status code 400', () => {
      const error = new BadRequestError('Requisição inválida');

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Requisição inválida');
    });

    it('deve usar mensagem padrão', () => {
      const error = new BadRequestError();

      expect(error.message).toBe('Bad Request');
    });
  });

  describe('UnauthorizedError', () => {
    it('deve ter status code 401', () => {
      const error = new UnauthorizedError('Não autorizado');

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Não autorizado');
    });

    it('deve usar mensagem padrão', () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe('Não autorizado');
    });
  });

  describe('ForbiddenError', () => {
    it('deve ter status code 403', () => {
      const error = new ForbiddenError('Acesso negado');

      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Acesso negado');
    });
  });

  describe('NotFoundError', () => {
    it('deve ter status code 404', () => {
      const error = new NotFoundError('Não encontrado');

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Não encontrado');
    });
  });

  describe('ConflictError', () => {
    it('deve ter status code 409', () => {
      const error = new ConflictError('Conflito');

      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Conflito');
    });
  });

  describe('ValidationError', () => {
    it('deve ter status code 422', () => {
      const error = new ValidationError('Validação falhou');

      expect(error.statusCode).toBe(422);
      expect(error.message).toBe('Validação falhou');
    });
  });
});

