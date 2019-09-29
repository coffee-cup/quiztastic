import * as dogNames from "dog-names";
import * as socket from "socket.io";
import logger from "./logger";
import * as store from "./store";
import { getQuestion } from "./trivia";
import { AskingState, Game, GameOptions, Player } from "./types";
import { shuffle } from "./utils";

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
    numQuestions: 0,
    joinable: true,
    players: { [admin.id]: admin },
    startDate: Date.now(),
    isSuddenDeath: false,
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

    const joinGame = (code: string, playerId: string) => {
      const game = store.getGame(code);

      if (!game) {
        return gameDoesNotExist("join", code);
      }

      const playerAlreadyInGame = game.players[playerId] != null;

      if (!playerAlreadyInGame && !game.joinable) {
        logger.info(`Join of game that is not joinable ${code}`);
        socket.emit("game info", { message: "game not joinable" });
        return;
      }

      let player = game.players[playerId];
      if (player == null) {
        player = createPlayer(playerId, game.options.startingLives);
        game.players[player.id] = player;
      }

      logger.info(`user joined gamed ${code}`);
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

    const nextQuestion = async (game: Game) => {
      game.gameState = {
        type: "loading",
      };
      saveGame(game);

      try {
        const question = await getQuestion(
          game.options.category,
          game.options.difficulty,
        );

        const possibleAnswers = [
          ...question.incorrect_answers,
          question.correct_answer,
        ];

        shuffle(possibleAnswers);

        game.gameState = {
          type: "asking",
          question: question.question,
          correctAnswer: question.correct_answer,
          possibleAnswers,
          playerAnswers: {},
        };

        game.numQuestions += 1;

        saveGame(game);
      } catch (e) {
        logger.error(e);
      }
    };

    const startGame = (code: string) => {
      const game = store.getGame(code);

      if (!game) {
        return gameDoesNotExist("start", code);
      }

      game.joinable = false;

      nextQuestion(game);
      logger.info(`Started game ${code}`);
    };

    const checkIfAllAnswered = (game: Game): boolean => {
      const askingState = game.gameState as AskingState;
      const allAnswered = Object.values(game.players).reduce(
        (acc, player) =>
          acc &&
          (player.lives <= 0 || askingState.playerAnswers[player.id] != null),
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

      logger.info(`${game.players[playerId].name} answer in game ${code}`);

      if (checkIfAllAnswered(game)) {
        logger.info("Game all answered!");

        const alivePlayers = Object.values(game.players)
          .filter(p => p.lives > 0)
          .map(p => p.id);
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

        const remainingPlayers = Object.values(game.players).filter(
          p => p.lives > 0,
        );

        if (remainingPlayers.length === 0) {
          // go to sudden death. game cannot end without a winner
          // reset lives of players who were alive before question to 1
          alivePlayers.forEach(pid => {
            game.players[pid].lives = 1;
          });

          game.gameState = {
            type: "results",
            answer: state.correctAnswer,
            correctPlayers,
          };

          game.isSuddenDeath = true;
        } else if (remainingPlayers.length === 1) {
          // game won
          game.gameState = {
            type: "finished",
            winnerId: remainingPlayers[0].id,
          };
        } else {
          game.gameState = {
            type: "results",
            answer: state.correctAnswer,
            correctPlayers,
          };
        }
      }

      saveGame(game);
    };

    const advanceRound = (code: string) => {
      const game = store.getGame(code);

      if (!game) {
        return gameDoesNotExist("next question", code);
      }

      nextQuestion(game);
      logger.info(`next question in ${code}`);
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

    socket.on("advance round", ({ code }: { code: string }) => {
      advanceRound(code);
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
