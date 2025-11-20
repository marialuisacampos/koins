import { FastifyRequest, FastifyReply } from 'fastify';
import { connectionService } from '@/services/connection.service';
import {
  sendInviteSchema,
  connectionIdParamSchema,
  SendInviteInput,
} from '@/schemas/connection.schema';
import { ValidationError } from '@/utils/errors';
import { UserPayload } from '@/types';

export class ConnectionController {
  async getConnectionState(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const user = request.user as UserPayload;
    const connectionState = await connectionService.getUserConnectionState(user.userId);

    reply.status(200).send({
      status: 'success',
      message: 'Estado da conexão obtido com sucesso',
      data: connectionState,
    });
  }

  async listConnections(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const user = request.user as UserPayload;
    const connections = await connectionService.listUserConnections(user.userId);

    reply.status(200).send({
      status: 'success',
      message: 'Conexões listadas com sucesso',
      data: connections,
    });
  }

  async sendInvite(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const user = request.user as UserPayload;

    const validation = sendInviteSchema.safeParse(request.body);
    if (!validation.success) {
      throw new ValidationError('Dados inválidos', validation.error.issues);
    }

    const connection = await connectionService.sendInvite(
      user.userId,
      validation.data as SendInviteInput
    );

    reply.status(201).send({
      status: 'success',
      message: 'Convite enviado com sucesso',
      data: connection,
    });
  }

  async acceptConnection(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const user = request.user as UserPayload;

    const validation = connectionIdParamSchema.safeParse(request.params);
    if (!validation.success) {
      throw new ValidationError('ID inválido', validation.error.issues);
    }

    const connection = await connectionService.acceptConnection(
      user.userId,
      validation.data.id
    );

    reply.status(200).send({
      status: 'success',
      message: 'Convite aceito com sucesso',
      data: connection,
    });
  }

  async rejectConnection(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const user = request.user as UserPayload;

    const validation = connectionIdParamSchema.safeParse(request.params);
    if (!validation.success) {
      throw new ValidationError('ID inválido', validation.error.issues);
    }

    await connectionService.rejectConnection(
      user.userId,
      validation.data.id
    );

    reply.status(200).send({
      status: 'success',
      message: 'Convite rejeitado e removido com sucesso',
    });
  }

  async cancelInvite(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const user = request.user as UserPayload;

    const validation = connectionIdParamSchema.safeParse(request.params);
    if (!validation.success) {
      throw new ValidationError('ID inválido', validation.error.issues);
    }

    await connectionService.cancelInvite(user.userId, validation.data.id);

    reply.status(200).send({
      status: 'success',
      message: 'Convite cancelado com sucesso',
    });
  }
}

export const connectionController = new ConnectionController();

