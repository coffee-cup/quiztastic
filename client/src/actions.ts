import { push } from "@prodo/route";
import uuid from "uuid/v4";
import { dispatch, local, state } from "./model";
import { Game, GameStatus } from "./types";

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
  dispatch(push)("/");
};

export const redirectGame = (code: string) => {
  dispatch(push)(`/game/${code}`);
};

export const readyPlayer = (name: string) => {
  if (socket && state.game && local.uid && name !== "") {
    local.name = name;

    socket.emit("ready player", {
      id: local.uid,
      code: state.game.code,
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
  state.game = game;
};

export const setError = (message: string) => {
  if (message === "game not joinable") {
    state.gameStatus = GameStatus.notJoinable;
  } else if (message === "game not found") {
    state.gameStatus = GameStatus.notFound;
  }
};
