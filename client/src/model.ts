import { createModel } from "@prodo/core";
import localPlugin from "@prodo/local";
import routePlugin from "@prodo/route";
import loggerPlugin from "@prodo/logger";
import { GameStatus, Game, CreateGameState } from "./types";

export interface State {
  categories?: string[];
  difficulties?: string[];
  createGameState?: CreateGameState;
  gameStatus: GameStatus;
  game?: Game;
}

export interface Local {
  uid: string;
}

export const model = createModel<State>()
  .with(localPlugin<Local>())
  .with(routePlugin)
  .with(loggerPlugin);

export const { state, dispatch, watch, local, route } = model.ctx;
