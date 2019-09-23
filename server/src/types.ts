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

export interface WaitingState {
  type: "waiting";
}

export interface AskingState {
  type: "asking";
  question: string;
  possibleAnswers: string[];
  correctAnswer: string;
  playerAnswers: { [id: string]: string };
}

export interface ResultsState {
  type: "results";
  correctPlayers: { [id: string]: boolean };
}

export interface FinishedState {
  type: "finished";
  winnerId: string;
}

export type GameState =
  | WaitingState
  | AskingState
  | ResultsState
  | FinishedState;

export interface Game {
  code: string;
  admin: string;
  joinable: boolean;
  players: { [id: string]: Player };
  startDate: number;
  options: GameOptions;
  gameState: GameState;
}
