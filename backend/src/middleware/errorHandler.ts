import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { ZodError } from 'zod';

export async function errorHandler(
  error: FastifyError | AppError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    logger.warn('Validation error', {
      path: request.url,
      method: request.method,
      errors: error.issues,
    });

    return reply.status(422).send({
      status: 'error',
      message: 'Erro de validação',
      errors: error.issues.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (error instanceof AppError) {
    logger.warn('Application error', {
      path: request.url,
      method: request.method,
      statusCode: error.statusCode,
      message: error.message,
    });

    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message,
    });
  }

  logger.error('Unhandled error', error, {
    path: request.url,
    method: request.method,
    statusCode: (error as FastifyError).statusCode || 500,
  });

  const statusCode = (error as FastifyError).statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : error.message || 'Erro interno do servidor';

  return reply.status(statusCode).send({
    status: 'error',
    message,
  });
}

