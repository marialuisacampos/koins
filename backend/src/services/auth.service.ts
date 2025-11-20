import { User } from '@prisma/client';
import { userRepository } from '@/repositories/user.repository';
import { connectionRepository } from '@/repositories/connection.repository';
import { hashPassword, comparePassword } from '@/utils/crypto';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import {
  createPasswordResetToken,
  verifyPasswordResetToken,
  deletePasswordResetToken,
} from '@/utils/passwordReset';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '@/utils/errors';
import { AuthTokens } from '@/types';
import { logger } from '@/utils/logger';
import {
  SignupInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  DeleteAccountInput,
} from '@/schemas/auth.schema';

export class AuthService {
  async signup(input: SignupInput): Promise<{ user: Omit<User, 'password_hash'>; tokens: AuthTokens }> {
    const { name, email, phone, password } = input;

    const existingUser = await userRepository.findByEmailIncludingDeleted(email);
    
    if (existingUser) {
      if (existingUser.deleted_at === null) {
        throw new ConflictError('Email já cadastrado');
      }

      const password_hash = await hashPassword(password);

      const reactivatedUser = await userRepository.reactivate(existingUser.id, {
        name,
        phone,
        password_hash,
      });

      logger.info('User account reactivated', {
        userId: reactivatedUser.id,
        email: reactivatedUser.email,
      });

      const pendingInvites = await connectionRepository.findByPartnerEmail(email);
      if (pendingInvites.length > 0) {
        for (const invite of pendingInvites) {
          await connectionRepository.updatePartnerConnection(invite.id, reactivatedUser.id);
          logger.info('Pending invite linked to reactivated user', {
            connectionId: invite.id,
            userId: reactivatedUser.id,
            inviterId: invite.user_id_from,
          });
        }
      }

      const tokens = generateTokens(reactivatedUser.id, reactivatedUser.email);

      const { password_hash: _, ...userWithoutPassword } = reactivatedUser;

      return { user: userWithoutPassword, tokens };
    }

    const password_hash = await hashPassword(password);

    const user = await userRepository.create({
      name,
      email,
      phone,
      password_hash,
    });

    const pendingInvites = await connectionRepository.findByPartnerEmail(email);
    if (pendingInvites.length > 0) {
      for (const invite of pendingInvites) {
        await connectionRepository.updatePartnerConnection(invite.id, user.id);
        logger.info('Pending invite linked to new user', {
          connectionId: invite.id,
          userId: user.id,
          inviterId: invite.user_id_from,
        });
      }
    }

    const tokens = generateTokens(user.id, user.email);

    const { password_hash: _, ...userWithoutPassword } = user;

    logger.info('User signed up', { userId: user.id, email: user.email });

    return { user: userWithoutPassword, tokens };
  }

  async login(input: LoginInput): Promise<{ user: Omit<User, 'password_hash'>; tokens: AuthTokens }> {
    const { email, password } = input;

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    const tokens = generateTokens(user.id, user.email);

    const { password_hash: _, ...userWithoutPassword } = user;

    logger.info('User logged in', { userId: user.id, email: user.email });

    return { user: userWithoutPassword, tokens };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = verifyRefreshToken(refreshToken);

      const user = await userRepository.findById(payload.userId);

      if (!user) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      const tokens = generateTokens(user.id, user.email);

      logger.info('Tokens refreshed with sliding window', { 
        userId: user.id,
        newAccessTokenExp: '1h',
        newRefreshTokenExp: '90d'
      });

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError('Refresh token inválido');
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<{ token: string }> {
    const { email } = input;

    const user = await userRepository.findByEmail(email);

    if (!user) {
      logger.warn('Forgot password requested for non-existent email', { email });
      return { token: 'fake-token-for-security' };
    }

    const token = createPasswordResetToken(user.id);

    logger.info('Password reset token created', { userId: user.id });

    return { token };
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const { token, password } = input;

    const userId = verifyPasswordResetToken(token);

    if (!userId) {
      throw new BadRequestError('Token inválido ou expirado');
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const password_hash = await hashPassword(password);

    await userRepository.updatePassword(userId, password_hash);

    deletePasswordResetToken(token);

    logger.info('Password reset successful', { userId });
  }

  async deleteAccount(userId: string, input: DeleteAccountInput): Promise<void> {
    const { password, reason } = input;

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Senha incorreta');
    }

    const deletedConnectionsCount = await connectionRepository.softDeleteAllByUserId(userId);
    
    await userRepository.softDelete(userId);

    logger.info('User account deleted (soft delete)', { 
      userId, 
      email: user.email,
      reason: reason || 'No reason provided',
      deletedConnections: deletedConnectionsCount
    });
  }
}

export const authService = new AuthService();

