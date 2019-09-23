export interface Player {
  id: string;
  name: string;
  ready: boolean;
  lives: number;
  admin: boolean;
}

export interface GameOptions {
  category: string;
  difficulty: string;
  startingLives: number;
}

export interface Game {
  code: string;
  admin: string;
  joinable: boolean;
  players: { [id: string]: Player };
  startDate: number;
  options: GameOptions;
}
