import { push } from "@prodo/route";
import uuid from "uuid/v4";
import { dispatch, local, state } from "./model";
import { State, Game, GameStatus } from "./types";

let socket: SocketIOClient.Socket | null = null;

export const setupSocket = (
  dispatch: any,
  mySocket: SocketIOClient.Socket | null,
) => {
  socket = mySocket;

  if (socket) {
    socket.on("disconnect", () => {
      dispatch(redirectHome)();
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
  state.currentGame = code;
  dispatch(push)(`/game/${code}`);
};

const getCurrentGame = (state: State): Game | null => {
  return state.currentGame != null ? state.games[state.currentGame] : null;
};

export const startGame = () => {
  const game = getCurrentGame(state);
  if (socket && game) {
    socket.emit("start game", { code: game.code });
  }
};

export const readyPlayer = (name: string) => {
  const game = getCurrentGame(state);
  if (socket && game && local.uid && name !== "") {
    local.name = name;

    socket.emit("ready player", {
      id: local.uid,
      code: game.code,
      name,
    });
  }
};

export const joinGame = (code: string, id: string, name?: string) => {
  if (socket) {
    socket.emit("join game", {
      code,
      id,
      name,
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
