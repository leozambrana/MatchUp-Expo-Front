import { authService } from './api/authService';

// Exportar funções para compatibilidade com código existente
export const loginUser = (credentials: { email: string; password: string }) => 
  authService.login(credentials);

export const registerUser = (userData: { name: string; email: string; password: string }) => 
  authService.register(userData);

// Exportar o serviço completo para uso avançado
export { authService };
