import * as MemoryCache from "memory-cache";
import { Game } from "./types";

const GAME_TIMEOUT = 1000 * 60 * 60 * 4; // 4 hours

const gameCache = new MemoryCache.Cache<string, Game>();

export const saveGame = (game: Game) => {
  gameCache.put(game.code, game, GAME_TIMEOUT);
};

export const getGame = (code: string): Game | undefined => {
  return gameCache.get(code);
};
