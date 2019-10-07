import { push } from "@prodo/route";
import uuid from "uuid/v4";
import * as api from "./api";
import { dispatch, local, state } from "./model";
import { Game, GameOptions, GameStatus, State } from "./types";

let socket: SocketIOClient.Socket | null = null;

export const setupSocket = (
  dispatch: any,
  mySocket: SocketIOClient.Socket | null,
) => {
  socket = mySocket;

  if (socket) {
    socket.on("disconnect", () => {
      socket = null;
    });

    socket.on("game", ({ game }: { game: Game }) => {
      dispatch(setGame)(game);
    });

    socket.on("game info", ({ message }: { message: string }) => {
      dispatch(setError)(message);
    });
  }
};

export const ensurePlayerUid = () => {
  if (!local.uid) {
    local.uid = uuid();
  }
};

export const redirectHome = () => {
  state.currentGame = null;
  dispatch(push)("/");
};

export const redirectGame = (code: string) => {
  state.currentGame = code.trim().toLowerCase();
  dispatch(push)(`/game/${state.currentGame}`);
};

const getCurrentGame = (state: State): Game | null => {
  return state.currentGame != null ? state.games[state.currentGame] : null;
};

export const readyPlayer = (name: string) => {
  const game = getCurrentGame(state);
  if (socket && game && local.uid && name !== "") {
    local.name = name;

    socket.emit("ready player", {
      playerId: local.uid,
      code: game.code,
      name,
    });
  }
};

export const startGame = () => {
  const game = getCurrentGame(state);
  if (socket && game) {
    socket.emit("start game", { code: game.code });
  }
};

export const answerQuestion = (answer: string) => {
  const game = getCurrentGame(state);
  if (socket && game) {
    socket.emit("answer question", {
      code: game.code,
      playerId: local.uid,
      answer,
    });
  }
};

export const advanceRound = () => {
  const game = getCurrentGame(state);
  if (socket && game) {
    socket.emit("advance round", {
      code: game.code,
    });
  }
};

export const joinGame = (code: string, name?: string) => {
  if (socket) {
    socket.emit("join game", {
      code,
      playerId: local.uid,
      name,
    });
  }
};

export const restartGame = async (code: string) => {
  const createGameOptions = state.createGameOptions;

  if (createGameOptions == null || local.uid == null) {
    return;
  }

  if (socket) {
    socket.emit("restart game", {
      code,
      gameOptions: createGameOptions,
    });
  }
};

export const setGame = (game: Game) => {
  state.gameStatus = GameStatus.found;
  state.currentGame = game.code;
  state.games[game.code] = game;
};

export const setError = (message: string) => {
  if (message === "game not joinable") {
    state.gameStatus = GameStatus.notJoinable;
  } else if (message === "game not found") {
    state.gameStatus = GameStatus.notFound;
  }
};

export const selectCategory = (category: string) => {
  state.createGameOptions!.category = category;
};

export const selectDifficulty = (difficulty: string) => {
  state.createGameOptions!.difficulty = difficulty;
};

export const selectStartingLives = (lives: number) => {
  state.createGameOptions!.startingLives = lives;
};

export const startCreateGame = async () => {
  const game = getCurrentGame(state);

  const gameOptions: GameOptions = {
    category: game != null ? game.options.category : "",
    difficulty: game != null ? game.options.difficulty : "",
    startingLives: game != null ? game.options.startingLives : 3,
  };

  try {
    state.categories = await api.getCategories();
    state.difficulties = await api.getDifficulties();

    if (game == null) {
      gameOptions.category = state.categories[0];
      gameOptions.difficulty = state.difficulties[0];
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
  }

  state.createGameOptions = gameOptions;
};

export const createGame = async () => {
  const createGameOptions = state.createGameOptions;

  if (createGameOptions == null || local.uid == null) {
    return;
  }

  const game = await api.createGame(local.uid, createGameOptions);

  dispatch(redirectGame)(game.code);
};
