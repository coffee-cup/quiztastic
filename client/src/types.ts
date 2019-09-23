export interface State {
  categories?: string[];
  difficulties?: string[];
  createGameOptions?: GameOptions;
  gameStatus: GameStatus;
  currentGame: string | null;
  games: { [code: string]: Game };
}

export interface Local {
  uid: string;
  name: string;
}

export interface Player {
  id: string;
  name: string;
  ready: boolean;
  lives: number;
  admin: boolean;
}

export enum GameStatus {
  loading,
  notFound,
  notJoinable,
  found,
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
  players: { [id: string]: Player };
  options: GameOptions;
  gameState: GameState;
}
