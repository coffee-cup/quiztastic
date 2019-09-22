import * as dogNames from "dog-names";
import * as socket from "socket.io";
import logger from "../logger";
import { getGame, saveGame } from "../store";
import { Game, Player } from "../types";

export const randomCode = (): string => dogNames.allRandom().toLowerCase();

export const createPlayer = (id: string, admin = false): Player => {
  return {
    id,
    name: "",
    lives: 3,
    ready: false,
    admin,
  };
};

export const createGame = (
  admin: Player,
  code: string,
  category: string,
  difficulty: string,
): Game => {
  return {
    code,
    admin: admin.id,
    joinable: true,
    players: [admin],
    startDate: Date.now(),
    options: {
      category,
      difficulty,
    },
  };
};

const getPlayer = (game: Game, playerId: string): Player | undefined =>
  game.players.filter(p => p.id === playerId)[0];

export const setupSocketRoutes = (io: socket.Server) => {
  io.on("connection", socket => {
    const joinGame = (code: string, id: string) => {
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

      let player = getPlayer(game, id);
      if (player == null) {
        player = createPlayer(id);
        game.players.push(player);
      }

      logger.info(`${player.name} joined gamed ${code}`);
      socket.join(code);

      saveGame(game);

      io.to(code).emit("game", { game });
    };

    const readyPlayer = (code: string, id: string, name: string) => {
      const game = getGame(code);

      if (!game) {
        logger.error(`Ready of invalid game ${code}`);
        socket.emit("game info", { message: "game not found" });
        return;
      }

      if (!getPlayer(game, id)) {
        logger.error(`player not in game ${code}`);
        return;
      }

      game.players = game.players.map(p => {
        if (p.id === id) {
          p.name = name;
          p.ready = true;
        }

        return p;
      });

      logger.info(`${name} ready in game ${code}`);
      saveGame(game);

      io.to(code).emit("game", { game });
    };

    socket.on("join game", ({ code, id }: { code: string; id: string }) => {
      joinGame(code, id);
    });

    socket.on(
      "ready player",
      ({ code, id, name }: { code: string; id: string; name: string }) => {
        readyPlayer(code, id, name);
      },
    );
  });
};
