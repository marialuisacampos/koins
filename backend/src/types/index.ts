export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RequestUser {
  userId: string;
  email: string;
}

export type UserPayload = RequestUser;

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';
export type ExpenseType = 'expense' | 'transfer';
export type PlanType = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

