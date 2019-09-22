import { local } from "./model";
import uuid from "uuid/v4";
import { push } from "@prodo/route";
import { state, dispatch } from "./model";
import { Game, GameStatus } from "./types";

export const ensurePlayerUid = () => {
  if (!local.uid) {
    local.uid = uuid();
  }
};

export const redirectGame = (code: string) => {
  dispatch(push)(`/game/${code}`);
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
