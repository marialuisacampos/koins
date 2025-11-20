import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConnectionRepository } from '../connection.repository';
import { prisma } from '@/config/database';

describe('ConnectionRepository', () => {
  let repository: ConnectionRepository;

  beforeEach(() => {
    repository = new ConnectionRepository();
    vi.clearAllMocks();
  });

  const mockConnection = {
    id: 'connection-id',
    user_id_from: 'user-1',
    user_id_to: 'user-2',
    partner_email: null,
    invited_by: 'user-1',
    status: 'pending' as const,
    created_at: new Date(),
    updated_at: new Date(),
    accepted_at: null,
    deleted_at: null,
  };

  describe('create', () => {
    it('deve criar conexão com ambos usuários', async () => {
      vi.mocked(prisma.connection.create).mockResolvedValue(mockConnection);

      const result = await repository.create({
        user_id_from: 'user-1',
        user_id_to: 'user-2',
        invited_by: 'user-1',
        status: 'pending',
      });

      expect(result).toEqual(mockConnection);
      expect(prisma.connection.create).toHaveBeenCalledWith({
        data: {
          user_id_from: 'user-1',
          user_id_to: 'user-2',
          invited_by: 'user-1',
          status: 'pending',
        },
      });
    });

    it('deve criar conexão com partner_email quando usuário não existe', async () => {
      const pendingConnection = {
        ...mockConnection,
        user_id_to: null,
        partner_email: 'partner@example.com',
      };
      vi.mocked(prisma.connection.create).mockResolvedValue(pendingConnection);

      const result = await repository.create({
        user_id_from: 'user-1',
        user_id_to: null,
        partner_email: 'partner@example.com',
        invited_by: 'user-1',
        status: 'pending',
      });

      expect(result.user_id_to).toBeNull();
      expect(result.partner_email).toBe('partner@example.com');
    });
  });

  describe('findByUsers', () => {
    it('deve encontrar conexão entre dois usuários', async () => {
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(mockConnection);

      const result = await repository.findByUsers('user-1', 'user-2');

      expect(result).toEqual(mockConnection);
      expect(prisma.connection.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { user_id_from: 'user-1', user_id_to: 'user-2' },
            { user_id_from: 'user-2', user_id_to: 'user-1' },
          ],
          deleted_at: null,
        },
      });
    });

    it('deve encontrar conexão independente da ordem dos usuários', async () => {
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(mockConnection);

      await repository.findByUsers('user-2', 'user-1');

      expect(prisma.connection.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { user_id_from: 'user-2', user_id_to: 'user-1' },
            { user_id_from: 'user-1', user_id_to: 'user-2' },
          ],
          deleted_at: null,
        },
      });
    });

    it('deve retornar null se não existe conexão', async () => {
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(null);

      const result = await repository.findByUsers('user-1', 'user-3');

      expect(result).toBeNull();
    });
  });

  describe('findPendingByUserId', () => {
    it('deve encontrar convite pendente do usuário', async () => {
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(mockConnection);

      const result = await repository.findPendingByUserId('user-1');

      expect(result).toEqual(mockConnection);
      expect(prisma.connection.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ user_id_from: 'user-1' }, { user_id_to: 'user-1' }],
          status: 'pending',
          deleted_at: null,
        },
      });
    });

    it('deve retornar null se não há convites pendentes', async () => {
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(null);

      const result = await repository.findPendingByUserId('user-1');

      expect(result).toBeNull();
    });
  });

  describe('findByPartnerEmail', () => {
    it('deve encontrar conexões pendentes por email do parceiro', async () => {
      const pendingConnections = [
        {
          ...mockConnection,
          user_id_to: null,
          partner_email: 'partner@example.com',
        },
      ];
      vi.mocked(prisma.connection.findMany).mockResolvedValue(pendingConnections);

      const result = await repository.findByPartnerEmail('partner@example.com');

      expect(result).toEqual(pendingConnections);
      expect(prisma.connection.findMany).toHaveBeenCalledWith({
        where: {
          partner_email: 'partner@example.com',
          user_id_to: null,
          deleted_at: null,
        },
      });
    });

    it('deve retornar array vazio se não há convites para o email', async () => {
      vi.mocked(prisma.connection.findMany).mockResolvedValue([]);

      const result = await repository.findByPartnerEmail('noinvite@example.com');

      expect(result).toEqual([]);
    });
  });

  describe('updatePartnerConnection', () => {
    it('deve vincular usuário a convite pendente', async () => {
      const updatedConnection = {
        ...mockConnection,
        user_id_to: 'new-user-id',
        partner_email: null,
      };
      vi.mocked(prisma.connection.update).mockResolvedValue(updatedConnection);

      const result = await repository.updatePartnerConnection('connection-id', 'new-user-id');

      expect(result.user_id_to).toBe('new-user-id');
      expect(result.partner_email).toBeNull();
      expect(prisma.connection.update).toHaveBeenCalledWith({
        where: { id: 'connection-id' },
        data: {
          user_id_to: 'new-user-id',
          partner_email: null,
          updated_at: expect.any(Date),
        },
      });
    });
  });

  describe('findById', () => {
    it('deve encontrar conexão por ID com dados dos usuários', async () => {
      const connectionWithUsers = {
        ...mockConnection,
        user_from: {
          id: 'user-1',
          name: 'User One',
          email: 'user1@example.com',
        },
        user_to: {
          id: 'user-2',
          name: 'User Two',
          email: 'user2@example.com',
        },
      };
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(connectionWithUsers as any);

      const result = await repository.findById('connection-id');

      expect(result).toEqual(connectionWithUsers);
      expect(prisma.connection.findUnique).toHaveBeenCalledWith({
        where: { id: 'connection-id' },
        include: {
          user_from: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          user_to: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    it('deve retornar null se conexão não existe', async () => {
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar status da conexão', async () => {
      const acceptedConnection = {
        ...mockConnection,
        status: 'accepted' as const,
        accepted_at: new Date(),
      };
      vi.mocked(prisma.connection.update).mockResolvedValue(acceptedConnection);

      const acceptedDate = new Date();
      const result = await repository.updateStatus('connection-id', 'accepted', acceptedDate);

      expect(result.status).toBe('accepted');
      expect(prisma.connection.update).toHaveBeenCalledWith({
        where: { id: 'connection-id' },
        data: {
          status: 'accepted',
          accepted_at: acceptedDate,
          updated_at: expect.any(Date),
        },
      });
    });
  });

  describe('softDelete', () => {
    it('deve fazer soft delete de uma conexão', async () => {
      const deletedConnection = {
        ...mockConnection,
        deleted_at: new Date(),
      };
      vi.mocked(prisma.connection.update).mockResolvedValue(deletedConnection);

      const result = await repository.softDelete('connection-id');

      expect(result.deleted_at).not.toBeNull();
      expect(prisma.connection.update).toHaveBeenCalledWith({
        where: { id: 'connection-id' },
        data: {
          deleted_at: expect.any(Date),
        },
      });
    });
  });

  describe('softDeleteAllByUserId', () => {
    it('deve fazer soft delete de todas conexões do usuário', async () => {
      vi.mocked(prisma.connection.updateMany).mockResolvedValue({ count: 3 });

      const result = await repository.softDeleteAllByUserId('user-1');

      expect(result).toBe(3);
      expect(prisma.connection.updateMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { user_id_from: 'user-1' },
            { user_id_to: 'user-1' },
          ],
          deleted_at: null,
        },
        data: {
          deleted_at: expect.any(Date),
        },
      });
    });

    it('deve retornar 0 se usuário não tem conexões', async () => {
      vi.mocked(prisma.connection.updateMany).mockResolvedValue({ count: 0 });

      const result = await repository.softDeleteAllByUserId('user-without-connections');

      expect(result).toBe(0);
    });
  });
});
