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
  answer: string;
  correctPlayers: { [id: string]: boolean };
}

export interface FinishedState {
  type: "finished";
  winnerId: string;
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
  joinable: boolean;
  players: { [id: string]: Player };
  startDate: number;
  isSuddenDeath: boolean;
  options: GameOptions;
  gameState: GameState;
}

export interface Question {
  category: string;
  type: "multiple" | "boolean";
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
