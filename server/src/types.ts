export interface Player {
  id: string;
  name: string;
  ready: boolean;
  lives: number;
}

export interface Game {
  code: string;
  admin: string;
  joinable: boolean;
  players: Player[];
  startDate: number;
  options: {
    category: string;
    difficulty: string;
  };
}
