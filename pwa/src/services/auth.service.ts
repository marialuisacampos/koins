import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/signup', data);
    
    if (response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    
    if (response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  async refresh(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post<{ tokens: AuthTokens }>('/api/auth/refresh', {
      refreshToken,
    });
    
    if (response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }
    
    return response.tokens;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/api/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/api/auth/reset-password', { token, password });
  },

  async deleteAccount(password: string, reason?: string): Promise<void> {
    await api.delete('/api/auth/account', {
      password,
      reason,
    });
    this.logout();
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  async refreshTokenOnStartup(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false;
    }

    try {
      await this.refresh();
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  },
};

