import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '@/utils/jwt';
import { UnauthorizedError } from '@/utils/errors';
import { RequestUser } from '@/types';

declare module 'fastify' {
  interface FastifyRequest {
    user?: RequestUser;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Token não fornecido');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Formato de token inválido');
    }

    const token = parts[1];

    const payload = verifyAccessToken(token);

    request.user = {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Token inválido');
  }
}

export const auth = authenticate;

