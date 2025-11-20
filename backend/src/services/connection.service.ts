import { Connection } from '@prisma/client';
import { userRepository } from '@/repositories/user.repository';
import { connectionRepository } from '@/repositories/connection.repository';
import { BadRequestError, NotFoundError, ConflictError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { SendInviteInput } from '@/schemas/connection.schema';

interface ConnectionState {
  status: 'no_connection' | 'invite_sent' | 'pending_request' | 'connected';
  connection?: any;
}

export class ConnectionService {
  async getUserConnectionState(userId: string): Promise<ConnectionState> {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const connection = await connectionRepository.findActiveByUserId(userId);

    if (!connection) {
      return { status: 'no_connection' };
    }

    const connectionWithDetails = await connectionRepository.findById(connection.id);

    if (connection.status === 'accepted') {
      return { 
        status: 'connected', 
        connection: connectionWithDetails
      };
    }

    if (connection.user_id_from === userId) {
      return { 
        status: 'invite_sent', 
        connection: connectionWithDetails
      };
    }

    if (connection.user_id_to === userId) {
      return { 
        status: 'pending_request', 
        connection: connectionWithDetails
      };
    }

    return { status: 'no_connection' };
  }

  async listUserConnections(userId: string): Promise<Connection[]> {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const connectionFrom = await connectionRepository.findPendingByUserId(userId);
    const connections: Connection[] = [];

    if (connectionFrom) {
      connections.push(connectionFrom);
    }

    return connections;
  }

  async sendInvite(userId: string, input: SendInviteInput): Promise<Connection> {
    const { partnerEmail } = input;

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (partnerEmail.toLowerCase() === user.email.toLowerCase()) {
      throw new BadRequestError('Você não pode enviar convite para si mesmo');
    }

    const existingConnection = await connectionRepository.findPendingByUserId(userId);
    if (existingConnection) {
      throw new ConflictError('Você já possui um convite pendente');
    }

    const partner = await userRepository.findByEmail(partnerEmail);

    if (partner) {
      const existingPartnerConnection = await connectionRepository.findByUsers(userId, partner.id);
      
      if (existingPartnerConnection) {
        throw new ConflictError('Já existe uma conexão com este usuário');
      }

      const connection = await connectionRepository.create({
        user_id_from: userId,
        user_id_to: partner.id,
        partner_email: null,
        invited_by: userId,
        status: 'pending',
      });

      logger.info('Connection invite sent to registered user', {
        from: userId,
        to: partner.id,
      });

      return connection;
    } else {
      const connection = await connectionRepository.create({
        user_id_from: userId,
        user_id_to: null,
        partner_email: partnerEmail.toLowerCase(),
        invited_by: userId,
        status: 'pending',
      });

      logger.info('Connection invite sent to unregistered email', {
        from: userId,
        partnerEmail: partnerEmail.toLowerCase(),
      });

      return connection;
    }
  }

  async acceptConnection(userId: string, connectionId: string): Promise<Connection> {
    const connection = await this.getConnectionById(connectionId);

    if (connection.user_id_to !== userId) {
      throw new BadRequestError('Você não pode aceitar este convite');
    }

    if (connection.status !== 'pending') {
      throw new BadRequestError('Este convite não está pendente');
    }

    const updatedConnection = await connectionRepository.updateStatus(
      connectionId,
      'accepted',
      new Date()
    );

    logger.info('Connection accepted', {
      connectionId,
      userId,
    });

    return updatedConnection;
  }

  async rejectConnection(userId: string, connectionId: string): Promise<void> {
    const connection = await this.getConnectionById(connectionId);

    if (connection.user_id_to !== userId) {
      throw new BadRequestError('Você não pode rejeitar este convite');
    }

    if (connection.status !== 'pending') {
      throw new BadRequestError('Este convite não está pendente');
    }

    await connectionRepository.hardDelete(connectionId);

    logger.info('Connection rejected and permanently deleted', {
      connectionId,
      userId,
    });
  }

  async cancelInvite(userId: string, connectionId: string): Promise<void> {
    const connection = await this.getConnectionById(connectionId);

    if (connection.user_id_from !== userId) {
      throw new BadRequestError('Você não pode cancelar este convite');
    }

    if (connection.status !== 'pending') {
      throw new BadRequestError('Apenas convites pendentes podem ser cancelados');
    }

    await connectionRepository.softDelete(connectionId);

    logger.info('Connection invite cancelled', {
      connectionId,
      userId,
    });
  }

  private async getConnectionById(connectionId: string): Promise<Connection> {
    const connection = await connectionRepository.findById(connectionId);
    
    if (!connection) {
      throw new NotFoundError('Convite não encontrado');
    }

    return connection;
  }
}

export const connectionService = new ConnectionService();

