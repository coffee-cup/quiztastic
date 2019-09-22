import { Game, Player } from "../types";
import * as dogNames from "dog-names";
import * as socket from "socket.io";
import { getGame, saveGame } from "../store";
import logger from "../logger";

const randomCode = (): string => dogNames.allRandom().toLowerCase();

export const createPlayer = (id: string): Player => {
  return {
    id,
    name: "",
    lives: 3,
    ready: false,
  };
};

export const createGame = (
  uid: string,
  category: string,
  difficulty: string,
): Game => {
  const admin = createPlayer(uid);

  const code = randomCode();

  return {
    code,
    admin: uid,
    joinable: true,
    players: [admin],
    startDate: Date.now(),
    options: {
      category,
      difficulty,
    },
  };
};

const isPlayerInGame = (game: Game, playerId: string): boolean =>
  game.players.reduce(
    (inGame: boolean, player) => inGame || player.id === playerId,
    false,
  );

export const setupSocketRoutes = (io: socket.Server) => {
  io.on("connection", socket => {
    socket.on(
      "join game",
      ({ code, playerId }: { code: string; playerId: string }) => {
        const game = getGame(code);

        if (!game) {
          logger.warn(`Join of invalid game ${code}`);
          socket.emit("game info", { message: "game not found" });
          return;
        }

        if (!game.joinable) {
          logger.info(`Join of game that is not joinable ${code}`);
          socket.emit("game info", { message: "game not joinable" });
          return;
        }

        logger.info(`Join of game ${code}`);
        socket.join(code);

        if (!isPlayerInGame) {
          const player = createPlayer(playerId);
          game.players.push(player);
        }

        saveGame(game);

        io.to(code).emit("game", { game });
      },
    );
  });
};
