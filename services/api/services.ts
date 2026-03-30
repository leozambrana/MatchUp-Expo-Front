// Centralização de todos os serviços da API
export { authService } from './authService';
export { gameService } from './gameService';

// Exportar cliente base para casos específicos
export { apiClient, api } from './index';

// Exportar types
export * from './types/auth';
export * from './types/game';
