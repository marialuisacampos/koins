import { FastifyReply, FastifyRequest } from 'fastify';

export async function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(404).send({
    status: 'error',
    message: 'Rota não encontrada',
    path: request.url,
  });
}

