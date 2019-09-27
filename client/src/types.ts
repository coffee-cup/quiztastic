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
  answer: string;
  correctPlayers: { [id: string]: boolean };
}

export interface FinishedState {
  type: "finished";
  winnerId: string | null;
}

export interface LoadingState {
  type: "loading";
}

export type GameState =
  | WaitingState
  | AskingState
  | ResultsState
  | FinishedState
  | LoadingState;

export interface Game {
  code: string;
  admin: string;
  numQuestions: number;
  players: { [id: string]: Player };
  options: GameOptions;
  gameState: GameState;
}
