import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '@/services/auth.service';
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  deleteAccountSchema,
} from '@/schemas/auth.schema';
import { UserPayload } from '@/types';

export class AuthController {
  async signup(request: FastifyRequest, reply: FastifyReply) {
    const input = signupSchema.parse(request.body);
    const result = await authService.signup(input);

    return reply.status(201).send({
      status: 'success',
      message: 'Usuário criado com sucesso',
      data: result,
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body);
    const result = await authService.login(input);

    return reply.status(200).send({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: result,
    });
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const input = refreshTokenSchema.parse(request.body);
    const tokens = await authService.refresh(input.refreshToken);

    return reply.status(200).send({
      status: 'success',
      message: 'Token atualizado com sucesso',
      data: { tokens },
    });
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const input = forgotPasswordSchema.parse(request.body);
    const result = await authService.forgotPassword(input);

    return reply.status(200).send({
      status: 'success',
      message: 'Se o email existir, você receberá um link para recuperação de senha',
      data: { token: result.token },
    });
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const input = resetPasswordSchema.parse(request.body);
    await authService.resetPassword(input);

    return reply.status(200).send({
      status: 'success',
      message: 'Senha alterada com sucesso',
    });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({
      status: 'success',
      message: 'Logout realizado com sucesso',
    });
  }

  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as UserPayload;
    const input = deleteAccountSchema.parse(request.body);
    
    await authService.deleteAccount(user.userId, input);

    return reply.status(200).send({
      status: 'success',
      message: 'Conta excluída com sucesso',
    });
  }
}

export const authController = new AuthController();

