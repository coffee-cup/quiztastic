import * as dogNames from "dog-names";
import * as socket from "socket.io";
import logger from "../logger";
import * as store from "../store";
import { AskingState, GameOptions, Game, Player } from "../types";

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

    const gameDoesNotExist = (event: string, code: string) => {
      logger.warn(`${event} of game [${code}] that does not exist`);
      socket.emit("game info", { message: "game not found" });
    };

    const joinGame = (code: string, id: string) => {
      const game = store.getGame(code);

      if (!game) {
        return gameDoesNotExist("join", code);
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

    const readyPlayer = (code: string, playerId: string, name: string) => {
      const game = store.getGame(code);

      if (!game) {
        return gameDoesNotExist("ready", code);
      }

      const player = game.players[playerId];
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
        return gameDoesNotExist("start", code);
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

    const checkIfAllAnswered = (game: Game): boolean => {
      const askingState = game.gameState as AskingState;
      const allAnswered = Object.values(game.players).reduce(
        (acc, player) => acc && askingState.playerAnswers[player.id] != null,
        true,
      );

      return allAnswered;
    };

    const answerQuestion = (code: string, playerId: string, answer: string) => {
      const game = store.getGame(code);

      if (!game) {
        return gameDoesNotExist("answer", code);
      }

      if (game.gameState.type !== "asking") {
        return;
      }

      const state = game.gameState;
      state.playerAnswers[playerId] = answer;

      if (checkIfAllAnswered(game)) {
        logger.info("Game all answered!");

        const correctPlayers: { [id: string]: boolean } = {};
        for (const player of Object.values(game.players)) {
          const playerAnswer = state.playerAnswers[player.id];
          const answerCorrect =
            playerAnswer != null && playerAnswer === state.correctAnswer;

          if (!answerCorrect) {
            game.players[player.id].lives -= 1;
          }

          correctPlayers[player.id] = answerCorrect;
        }

        game.gameState = {
          type: "results",
          answer: state.correctAnswer,
          correctPlayers,
        };

        saveGame(game);
      }
    };

    socket.on(
      "join game",
      ({ code, playerId }: { code: string; playerId: string }) => {
        joinGame(code, playerId);
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
        readyPlayer(code, playerId, name);
      },
    );

    socket.on("start game", ({ code }: { code: string }) => {
      startGame(code);
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
        answerQuestion(code, playerId, answer);
      },
    );
  });
};
