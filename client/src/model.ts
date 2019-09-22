import { createModel } from "@prodo/core";
import localPlugin from "@prodo/local";
import loggerPlugin from "@prodo/logger";
import routePlugin from "@prodo/route";
import { CreateGameState, Game, GameStatus } from "./types";

export interface State {
  categories?: string[];
  difficulties?: string[];
  createGameState?: CreateGameState;
  gameStatus: GameStatus;
  game?: Game;
}

export interface Local {
  uid: string;
  name: string;
}

export const model = createModel<State>()
  .with(localPlugin<Local>())
  .with(routePlugin)
  .with(loggerPlugin);

export const { state, dispatch, watch, local, route } = model.ctx;
