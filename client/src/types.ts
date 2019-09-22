export interface Player {
  id: string;
  name: string;
  ready: boolean;
  lives: number;
}

export enum GameStatus {
  loading,
  notFound,
  notJoinable,
  found,
}

export interface Game {
  code: string;
  players: Player[];
  options: {
    category: string;
    difficulty: string;
  };
}

export interface CreateGameState {
  selectedCategory: string;
  selectedDifficulty: string;
}
