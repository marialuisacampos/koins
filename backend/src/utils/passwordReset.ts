import { generateRandomToken } from './crypto';

interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: Date;
}

const resetTokens = new Map<string, PasswordResetToken>();

export function createPasswordResetToken(userId: string): string {
  const token = generateRandomToken(64);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  const existingTokens = Array.from(resetTokens.entries())
    .filter(([, data]) => data.userId === userId)
    .map(([key]) => key);

  existingTokens.forEach((key) => resetTokens.delete(key));

  resetTokens.set(token, { token, userId, expiresAt });

  return token;
}

export function verifyPasswordResetToken(token: string): string | null {
  const data = resetTokens.get(token);

  if (!data) {
    return null;
  }

  if (data.expiresAt < new Date()) {
    resetTokens.delete(token);
    return null;
  }

  return data.userId;
}

export function deletePasswordResetToken(token: string): void {
  resetTokens.delete(token);
}

setInterval(() => {
  const now = new Date();
  const expiredTokens = Array.from(resetTokens.entries())
    .filter(([, data]) => data.expiresAt < now)
    .map(([key]) => key);

  expiredTokens.forEach((key) => resetTokens.delete(key));
}, 60 * 60 * 1000);

