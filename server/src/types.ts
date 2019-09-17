export interface Player {
  id: string;
  name: string;
  admin: boolean;
}

export interface Game {
  code: string;
  players: Player[];
  startDate: number;
}
