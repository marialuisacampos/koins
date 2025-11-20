import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserRepository } from '../user.repository';
import { prisma } from '@/config/database';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
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

  describe('create', () => {
    it('deve criar usuário', async () => {
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

      const result = await repository.create({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+5511999999999',
        password_hash: 'hashed-password',
      });

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+5511999999999',
          password_hash: 'hashed-password',
        },
      });
    });

    it('deve criar usuário sem telefone', async () => {
      const userWithoutPhone = { ...mockUser, phone: null };
      vi.mocked(prisma.user.create).mockResolvedValue(userWithoutPhone);

      const result = await repository.create({
        name: 'Test User',
        email: 'test@example.com',
        password_hash: 'hashed-password',
      });

      expect(result.phone).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('deve encontrar usuário por email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deleted_at: null },
      });
    });

    it('deve retornar null se usuário não existe', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await repository.findByEmail('naoexiste@example.com');

      expect(result).toBeNull();
    });

    it('deve ignorar usuários deletados', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await repository.findByEmail('deleted@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'deleted@example.com', deleted_at: null },
      });
    });
  });

  describe('findById', () => {
    it('deve encontrar usuário por id', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await repository.findById('user-id');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id', deleted_at: null },
      });
    });

    it('deve retornar null se usuário não existe', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await repository.findById('id-inexistente');

      expect(result).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('deve atualizar senha do usuário', async () => {
      const updatedUser = { ...mockUser, password_hash: 'new-hash' };
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser);

      const result = await repository.updatePassword('user-id', 'new-hash');

      expect(result.password_hash).toBe('new-hash');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: {
          password_hash: 'new-hash',
          updated_at: expect.any(Date),
        },
      });
    });
  });

  describe('existsByEmail', () => {
    it('deve retornar true se email existe', async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(1);

      const result = await repository.existsByEmail('test@example.com');

      expect(result).toBe(true);
      expect(prisma.user.count).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deleted_at: null },
      });
    });

    it('deve retornar false se email não existe', async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      const result = await repository.existsByEmail('naoexiste@example.com');

      expect(result).toBe(false);
    });
  });
});

