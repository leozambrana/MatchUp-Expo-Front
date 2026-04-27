import { storage } from '@/utils/secure';
import { apiClient } from '@/core/api/client';
import {
  AuthResponse,
  ConfirmResetPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest
} from '@/types/entities/auth';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔑 Attempting login for:', credentials.email);
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      await this.saveToken(response.data.token);
      console.log('✅ Login successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting registration for:', userData.email);
      const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
      await this.saveToken(response.data.token);
      console.log('✅ Registration successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out...');
      try {
        await apiClient.post('/api/auth/logout');
      } catch {
        console.warn('Logout endpoint failed, proceeding with local logout');
      }
      await this.removeToken();
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout failed:', error);
      await this.removeToken();
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      console.log('📧 Requesting password reset for:', email);
      await apiClient.post<ResetPasswordRequest>('/api/auth/forgot-password', { email });
      console.log('✅ Password reset email sent');
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      throw error;
    }
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    try {
      console.log('🔄 Confirming password reset');
      await apiClient.post<ConfirmResetPasswordRequest>('/api/auth/reset-password', {
        token,
        newPassword,
      });
      console.log('✅ Password reset successful');
    } catch (error: any) {
      console.error('❌ Password reset confirmation failed:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      console.log('🔄 Refreshing token');
      const response = await apiClient.post<{ token: string }>('/api/auth/refresh');
      await this.saveToken(response.data.token);
      console.log('✅ Token refreshed successfully');
      return response.data.token;
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);
      await this.removeToken();
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await storage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async saveToken(token: string): Promise<void> {
    try {
      await storage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Não foi possível salvar o token de autenticação');
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await storage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}

export const authService = new AuthService();