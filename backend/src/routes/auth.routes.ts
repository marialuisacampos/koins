import { FastifyInstance } from 'fastify';
import { authController } from '@/controllers/auth.controller';
import { auth } from '@/middleware/auth';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', {
    handler: authController.signup.bind(authController),
  });

  fastify.post('/login', {
    handler: authController.login.bind(authController),
  });

  fastify.post('/refresh', {
    handler: authController.refresh.bind(authController),
  });

  fastify.post('/forgot-password', {
    handler: authController.forgotPassword.bind(authController),
  });

  fastify.post('/reset-password', {
    handler: authController.resetPassword.bind(authController),
  });

  fastify.post('/logout', {
    handler: authController.logout.bind(authController),
  });

  fastify.delete('/account', {
    preHandler: auth,
    handler: authController.deleteAccount.bind(authController),
  });
}

