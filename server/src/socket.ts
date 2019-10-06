import * as socket from "socket.io";
import {
  advanceRound,
  answerQuestion,
  joinGame,
  readyPlayer,
  startGame,
  restartGame,
} from "./game";
import logger from "./logger";
import * as store from "./store";
import { Game, GameOptions } from "./types";

export const setupSocketRoutes = (io: socket.Server) => {
  io.on("connection", socket => {
    const saveGame = (game: Game) => {
      store.saveGame(game);
      io.to(game.code).emit("game", { game });
    };

    const gameDoesNotExist = (code: string) => {
      logger.warn(`game ${code} does not exist`);
      socket.emit("game info", { message: "game not found" });
    };

    const withGame = async (
      code: string,
      fn: (game: Game) => AsyncGenerator<Game>,
    ) => {
      try {
        const game = store.getGame(code);
        if (!game) {
          return gameDoesNotExist(code);
        }

        for await (const nextGame of fn(game)) {
          saveGame(nextGame);
        }
      } catch (e) {
        logger.warn(e.message);
        socket.emit("game info", { message: e.message });
      }
    };

    socket.on(
      "join game",
      ({ code, playerId }: { code: string; playerId: string }) => {
        withGame(code, game => {
          socket.join(game.code);
          return joinGame(game, playerId);
        });
      },
    );

    socket.on(
      "ready player",
      ({
        code,
        playerId,
        name,
      }: {
        code: string;
        playerId: string;
        name: string;
      }) => {
        withGame(code, game => readyPlayer(game, playerId, name));
      },
    );

    socket.on("start game", ({ code }: { code: string }) => {
      withGame(code, startGame);
    });

    socket.on("advance round", ({ code }: { code: string }) => {
      withGame(code, advanceRound);
    });

    socket.on(
      "answer question",
      ({
        code,
        playerId,
        answer,
      }: {
        code: string;
        playerId: string;
        answer: string;
      }) => {
        withGame(code, game => answerQuestion(game, playerId, answer));
      },
    );

    socket.on(
      "restart game",
      ({ code, gameOptions }: { code: string; gameOptions: GameOptions }) => {
        withGame(code, game => restartGame(game, gameOptions));
      },
    );
  });
};
