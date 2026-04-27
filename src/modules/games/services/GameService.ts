import { apiClient } from '@/core/api/client';
import { 
  Game, 
  CreateGameRequest, 
  UpdateGameRequest, 
  JoinGameRequest,
  GameFilters 
} from '@/types/entities/game';

class GameService {
  // Listar jogos do usuário
  async getMyGames(filters?: GameFilters): Promise<{ games: Game[] }> {
    try {
      console.log('🏈 Getting my games');
      
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/api/games?${queryString}` : '/api/games';
      
      const response = await apiClient.get<Game[]>(url);
      
      console.log('✅ My games retrieved successfully', response.data);
      return { games: response.data };
    } catch (error: any) {
      console.error('❌ Failed to get my games:', error);
      throw error;
    }
  }

  // Listar todos os jogos disponíveis
  async getAvailableGames(filters?: GameFilters): Promise<{ games: Game[] }> {
    try {
      console.log('🏈 Getting available games');
      
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/api/games?${queryString}` : '/api/games';
      
      const response = await apiClient.get<Game[]>(url);
      
      console.log('✅ Available games retrieved successfully', response.data);
      return { games: response.data };
    } catch (error: any) {
      console.error('❌ Failed to get available games:', error);
      throw error;
    }
  }

  // Obter detalhes de um jogo
  async getGameById(gameId: string): Promise<Game> {
    try {
      console.log('🏈 Getting game details:', gameId);
      
      const response = await apiClient.get<Game>(`/api/games/${gameId}`);
      
      console.log('✅ Game details retrieved successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to get game details:', error);
      throw error;
    }
  }

  // Criar novo jogo
  async createGame(gameData: CreateGameRequest): Promise<Game> {
    try {
      console.log('🏈 Creating new game');
      
      const response = await apiClient.post<Game>('/api/games', gameData);
      
      console.log('✅ Game created successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create game:', error);
      throw error;
    }
  }

  // Atualizar jogo
  async updateGame(gameId: string, gameData: UpdateGameRequest): Promise<Game> {
    try {
      console.log('🏈 Updating game:', gameId);
      
      const response = await apiClient.put<Game>(`/api/games/${gameId}`, gameData);
      
      console.log('✅ Game updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to update game:', error);
      throw error;
    }
  }

  // Deletar jogo
  async deleteGame(gameId: string): Promise<void> {
    try {
      console.log('🏈 Deleting game:', gameId);
      
      await apiClient.delete(`/api/games/${gameId}`);
      
      console.log('✅ Game deleted successfully');
    } catch (error: any) {
      console.error('❌ Failed to delete game:', error);
      throw error;
    }
  }

  // Participar de um jogo
  async joinGame(gameId: string): Promise<void> {
    try {
      console.log('🏈 Joining game:', gameId);
      
      await apiClient.post<JoinGameRequest>(`/api/games/${gameId}/join`);
      
      console.log('✅ Successfully joined game');
    } catch (error: any) {
      console.error('❌ Failed to join game:', error);
      throw error;
    }
  }

  // Sair de um jogo
  async leaveGame(gameId: string): Promise<void> {
    try {
      console.log('🏈 Leaving game:', gameId);
      
      await apiClient.post(`/api/games/${gameId}/leave`);
      
      console.log('✅ Successfully left game');
    } catch (error: any) {
      console.error('❌ Failed to leave game:', error);
      throw error;
    }
  }

  // Confirmar presença em jogo
  async confirmAttendance(gameId: string): Promise<void> {
    try {
      console.log('🏈 Confirming attendance for game:', gameId);
      
      await apiClient.post(`/api/games/${gameId}/confirm`);
      
      console.log('✅ Attendance confirmed successfully');
    } catch (error: any) {
      console.error('❌ Failed to confirm attendance:', error);
      throw error;
    }
  }

  // Cancelar jogo
  async cancelGame(gameId: string): Promise<Game> {
    try {
      console.log('🏈 Canceling game:', gameId);
      
      const response = await apiClient.patch<Game>(`/api/games/${gameId}/cancel`);
      
      console.log('✅ Game canceled successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to cancel game:', error);
      throw error;
    }
  }
}

// Export singleton
export const gameService = new GameService();
