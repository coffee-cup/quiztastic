import * as dogNames from "dog-names";
import logger from "./logger";
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

const nextQuestion = async (game: Game): Promise<Game> => {
  try {
    const question = await getQuestion(
      game.options.category,
      game.options.difficulty,
    );

    let possibleAnswers = [
      ...question.incorrect_answers,
      question.correct_answer,
    ];

    // true/false question should always be in same order
    if (question.type === "multiple") {
      shuffle(possibleAnswers);
    } else {
      possibleAnswers = possibleAnswers.sort().reverse();
    }

    game.gameState = {
      type: "asking",
      question: question.question,
      correctAnswer: question.correct_answer,
      possibleAnswers,
      playerAnswers: {},
    };

    game.numQuestions += 1;

    return game;
  } catch (e) {
    throw new Error("error fetching question");
  }
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

export async function* restartGame(game: Game, gameOptions: GameOptions) {
  game.options = gameOptions;
  game.numQuestions = 0;
  game.isSuddenDeath = false;
  game.joinable = true;

  Object.values(game.players).forEach(p => {
    p.ready = true;
    p.lives = game.options.startingLives;
  });

  game.gameState = {
    type: "waiting",
  };

  yield game;
}

export async function* joinGame(game: Game, playerId: string) {
  const playerAlreadyInGame = game.players[playerId] != null;

  if (!playerAlreadyInGame && !game.joinable) {
    throw new Error("game not joinable");
  }

  let player = game.players[playerId];
  if (player == null) {
    player = createPlayer(playerId, game.options.startingLives);
    game.players[player.id] = player;
  }

  logger.info(`user joined gamed ${game.code}`);

  yield game;
}

export async function* readyPlayer(game: Game, playerId: string, name: string) {
  const player = game.players[playerId];
  if (!player) {
    throw new Error("player not in game");
  }

  player.name = name;
  player.ready = true;

  logger.info(`${name} ready in game ${game.code}`);

  yield game;
}

export async function* startGame(game: Game) {
  game.joinable = false;
  game.gameState = {
    type: "loading",
  };
  yield game;

  const nextGame = await nextQuestion(game);
  yield nextGame;
}

export async function* advanceRound(game: Game) {
  yield* startGame(game);
}

export async function* answerQuestion(
  game: Game,
  playerId: string,
  answer: string,
) {
  if (game.gameState.type !== "asking") {
    return;
  }

  const state = game.gameState;
  state.playerAnswers[playerId] = answer;

  logger.info(`${game.players[playerId].name} answer in game ${game.code}`);

  if (checkIfAllAnswered(game)) {
    const alivePlayers = Object.values(game.players)
      .filter(p => p.lives > 0)
      .map(p => p.id);

    // check which players are correct
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

    const isSinglePlayerGame = Object.values(game.players).length === 1;
    const remainingPlayers = Object.values(game.players).filter(
      p => p.lives > 0,
    );

    if (isSinglePlayerGame) {
      const player = Object.values(game.players)[0];

      if (player.lives === 0) {
        game.gameState = {
          type: "finished",
          winnerId: player.id,
        };
      } else {
        game.gameState = {
          type: "results",
          answer: state.correctAnswer,
          correctPlayers,
        };
      }
    } else {
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
  }

  yield game;
}
