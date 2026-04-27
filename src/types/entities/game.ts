// Types para jogos
export interface Game {
  id: string;
  title: string;
  description?: string;
  dateTime: string;
  location: string;
  creatorEmail: string;
  status?: 'scheduled' | 'ongoing' | 'finished' | 'cancelled';
}

export interface Player {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  confirmed: boolean;
  joinedAt: string;
}

export interface CreateGameRequest {
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
  price: number;
}

export interface UpdateGameRequest {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  maxPlayers?: number;
  price?: number;
  status?: 'scheduled' | 'ongoing' | 'finished' | 'cancelled';
}

export interface JoinGameRequest {
  gameId: string;
}

export interface GameFilters {
  status?: Game['status'];
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}
