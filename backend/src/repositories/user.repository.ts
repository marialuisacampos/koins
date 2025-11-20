import { prisma } from '@/config/database';
import { User } from '@prisma/client';

export class UserRepository {
  async create(data: {
    name: string;
    email: string;
    phone?: string;
    password_hash: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email, deleted_at: null },
    });
  }

  async findByEmailIncludingDeleted(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id, deleted_at: null },
    });
  }

  async updatePassword(userId: string, password_hash: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { password_hash, updated_at: new Date() },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email, deleted_at: null },
    });
    return count > 0;
  }

  async softDelete(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { deleted_at: new Date() },
    });
  }

  async reactivate(
    userId: string,
    data: {
      name: string;
      phone?: string;
      password_hash: string;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        password_hash: data.password_hash,
        deleted_at: null,
        updated_at: new Date(),
      },
    });
  }
}

export const userRepository = new UserRepository();

