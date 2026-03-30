import { apiClient } from './index';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ResetPasswordRequest,
  ConfirmResetPasswordRequest 
} from './types/auth';
import * as SecureStore from 'expo-secure-store';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔑 Attempting login for:', credentials.email);
      
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      
      // Salva o token
      await this.saveToken(response.data.token);
      
      console.log('✅ Login successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  // Registro
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting registration for:', userData.email);
      
      const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
      
      // Salva o token
      await this.saveToken(response.data.token);
      
      console.log('✅ Registration successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out...');
      
      // Chama endpoint de logout se existir
      try {
        await apiClient.post('/api/auth/logout');
      } catch {
        // Se der erro, continua com logout local
        console.warn('Logout endpoint failed, proceeding with local logout');
      }
      
      // Remove token localmente
      await this.removeToken();
      
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout failed:', error);
      // Mesmo se der erro, remove token local
      await this.removeToken();
      throw error;
    }
  }

  // Esqueci a senha
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

  // Confirmar reset de senha
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

  // Refresh token
  async refreshToken(): Promise<string> {
    try {
      console.log('🔄 Refreshing token');
      
      const response = await apiClient.post<{ token: string }>('/api/auth/refresh');
      
      // Atualiza o token
      await this.saveToken(response.data.token);
      
      console.log('✅ Token refreshed successfully');
      return response.data.token;
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);
      // Se não conseguir refresh, remove token inválido
      await this.removeToken();
      throw error;
    }
  }

  // Obter token salvo
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Salvar token
  private async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Não foi possível salvar o token de autenticação');
    }
  }

  // Remover token
  private async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Verificar se está autenticado
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

// Export singleton
export const authService = new AuthService();
