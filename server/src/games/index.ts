import * as dogNames from "dog-names";
import * as socket from "socket.io";
import logger from "../logger";
import * as store from "../store";
import { GameOptions, Game, Player } from "../types";

export const randomCode = (): string => dogNames.allRandom().toLowerCase();

export const createPlayer = (
  id: string,
  lives: number,
  admin = false,
): Player => {
  return {
    id,
    name: "",
    lives,
    ready: false,
    admin,
  };
};

export const createGame = (
  admin: Player,
  code: string,
  options: GameOptions,
): Game => {
  return {
    code,
    admin: admin.id,
    joinable: true,
    players: { [admin.id]: admin },
    startDate: Date.now(),
    options,
    gameState: {
      type: "waiting",
    },
  };
};

export const setupSocketRoutes = (io: socket.Server) => {
  io.on("connection", socket => {
    const saveGame = (game: Game) => {
      store.saveGame(game);
      io.to(game.code).emit("game", { game });
    };

    const joinGame = (code: string, id: string) => {
      const game = store.getGame(code);

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

      let player = game.players[id];
      if (player == null) {
        player = createPlayer(id, game.options.startingLives);
        game.players[player.id] = player;
      }

      logger.info(`${player.name} joined gamed ${code}`);
      socket.join(code);

      saveGame(game);
    };

    const readyPlayer = (code: string, id: string, name: string) => {
      const game = store.getGame(code);

      if (!game) {
        logger.error(`Ready of invalid game ${code}`);
        socket.emit("game info", { message: "game not found" });
        return;
      }

      const player = game.players[id];
      if (!player) {
        logger.error(`player not in game ${code}`);
        return;
      }

      player.name = name;
      player.ready = true;

      logger.info(`${name} ready in game ${code}`);
      saveGame(game);

      io.to(code).emit("game", { game });
    };

    const startGame = (code: string) => {
      const game = store.getGame(code);

      if (!game) {
        logger.error(`start of invalid game ${code}`);
        socket.emit("game info", { message: "game not found" });
        return;
      }

      game.gameState = {
        type: "asking",
        question: "How are you doing?",
        correctAnswer: "Good",
        possibleAnswers: ["Good", "Bad"],
        playerAnswers: {},
      };

      logger.info(`Started game ${code}`);

      saveGame(game);
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

    socket.on("start game", ({ code }: { code: string }) => {
      startGame(code);
    });
  });
};
