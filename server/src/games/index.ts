import { Game, Player } from "../types";

const randomCode = (): string => Math.random().toString();

export const createGame = (players: Player[]): Game => {
  const code = randomCode();

  return {
    code,
    players,
    startDate: Date.now(),
  };
};
