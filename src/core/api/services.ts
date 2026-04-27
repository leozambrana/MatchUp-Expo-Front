// Centralização de todos os serviços da API (Opcional, seguindo a nova arquitetura)
export { authService } from '@/modules/auth/services/AuthService';
export { gameService } from '@/modules/games/services/GameService';

// Exportar cliente base para casos específicos
export { apiClient } from './client';

// Exportar types das entidades
export * from '@/types/entities/auth';
export * from '@/types/entities/game';
