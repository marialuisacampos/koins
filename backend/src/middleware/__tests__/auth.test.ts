import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authenticate } from '../auth';

vi.mock('@/utils/jwt');

describe('Auth Middleware', () => {
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockReply = {};
    vi.clearAllMocks();
  });

  it('deve autenticar com token válido', async () => {
    mockRequest.headers.authorization = 'Bearer valid-token';

    const { verifyAccessToken } = await import('@/utils/jwt');
    vi.mocked(verifyAccessToken).mockReturnValue({
      userId: 'user-id',
      email: 'test@example.com',
      iat: 123456,
      exp: 789012,
    });

    await authenticate(mockRequest, mockReply);

    expect(mockRequest.user).toEqual({
      userId: 'user-id',
      email: 'test@example.com',
    });
  });

  it('deve rejeitar sem header de autorização', async () => {
    await expect(authenticate(mockRequest, mockReply)).rejects.toThrow();
  });

  it('deve rejeitar formato de header inválido', async () => {
    mockRequest.headers.authorization = 'InvalidFormat token';

    await expect(authenticate(mockRequest, mockReply)).rejects.toThrow();
  });

  it('deve rejeitar sem Bearer prefix', async () => {
    mockRequest.headers.authorization = 'token-only';

    await expect(authenticate(mockRequest, mockReply)).rejects.toThrow();
  });

  it('deve rejeitar token inválido', async () => {
    mockRequest.headers.authorization = 'Bearer invalid-token';

    const { verifyAccessToken } = await import('@/utils/jwt');
    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw new Error('Token inválido');
    });

    await expect(authenticate(mockRequest, mockReply)).rejects.toThrow();
  });

  it('deve rejeitar header vazio após Bearer', async () => {
    mockRequest.headers.authorization = 'Bearer ';

    await expect(authenticate(mockRequest, mockReply)).rejects.toThrow();
  });
});
