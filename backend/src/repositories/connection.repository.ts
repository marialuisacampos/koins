import { prisma } from '@/config/database';
import { Connection, ConnectionStatus } from '@prisma/client';

export class ConnectionRepository {
  async create(data: {
    user_id_from: string;
    user_id_to?: string | null;
    partner_email?: string | null;
    invited_by: string;
    status: ConnectionStatus;
  }): Promise<Connection> {
    return prisma.connection.create({
      data,
    });
  }

  async findByUsers(userId1: string, userId2: string): Promise<Connection | null> {
    return prisma.connection.findFirst({
      where: {
        OR: [
          { user_id_from: userId1, user_id_to: userId2 },
          { user_id_from: userId2, user_id_to: userId1 },
        ],
        deleted_at: null,
      },
    });
  }

  async findPendingByUserId(userId: string): Promise<Connection | null> {
    return prisma.connection.findFirst({
      where: {
        OR: [{ user_id_from: userId }, { user_id_to: userId }],
        status: 'pending',
        deleted_at: null,
      },
    });
  }

  async findActiveByUserId(userId: string): Promise<Connection | null> {
    return prisma.connection.findFirst({
      where: {
        OR: [{ user_id_from: userId }, { user_id_to: userId }],
        status: { in: ['pending', 'accepted'] },
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByPartnerEmail(email: string): Promise<Connection[]> {
    return prisma.connection.findMany({
      where: {
        partner_email: email,
        user_id_to: null,
        deleted_at: null,
      },
    });
  }

  async updatePartnerConnection(connectionId: string, userId: string): Promise<Connection> {
    return prisma.connection.update({
      where: { id: connectionId },
      data: {
        user_id_to: userId,
        partner_email: null,
        updated_at: new Date(),
      },
    });
  }

  async findById(connectionId: string): Promise<Connection | null> {
    return prisma.connection.findUnique({
      where: { id: connectionId },
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
  }

  async updateStatus(
    connectionId: string,
    status: ConnectionStatus,
    acceptedAt?: Date
  ): Promise<Connection> {
    return prisma.connection.update({
      where: { id: connectionId },
      data: {
        status,
        accepted_at: acceptedAt,
        updated_at: new Date(),
      },
    });
  }

  async softDelete(connectionId: string): Promise<Connection> {
    return prisma.connection.update({
      where: { id: connectionId },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async softDeleteAllByUserId(userId: string): Promise<number> {
    const result = await prisma.connection.updateMany({
      where: {
        OR: [
          { user_id_from: userId },
          { user_id_to: userId },
        ],
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return result.count;
  }

  async hardDelete(connectionId: string): Promise<void> {
    await prisma.connection.delete({
      where: { id: connectionId },
    });
  }
}

export const connectionRepository = new ConnectionRepository();

