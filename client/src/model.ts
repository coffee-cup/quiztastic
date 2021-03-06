import { createModel } from "@prodo/core";
import localPlugin from "@prodo/local";
import loggerPlugin from "@prodo/logger";
import routePlugin from "@prodo/route";
import { Local, State } from "./types";

export const model = createModel<State>()
  .with(localPlugin<Local>())
  .with(routePlugin)
  .with(loggerPlugin);

export const { state, dispatch, watch, local, route } = model.ctx;
