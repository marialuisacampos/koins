import { vi } from 'vitest';

process.env.JWT_SECRET = 'test-jwt-secret-min-64-chars-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-64-chars-bbbbbbbbbbbbbbbbbbbbbbbbbbbb';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.BCRYPT_ROUNDS = '10';
process.env.NODE_ENV = 'test';

vi.mock('@/config/database', () => {
  const mockPrisma = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    connection: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };

  return {
    prisma: mockPrisma,
    connectDatabase: vi.fn(),
    disconnectDatabase: vi.fn(),
  };
});

