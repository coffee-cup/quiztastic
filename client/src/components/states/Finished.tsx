import * as React from "react";
import { local, state, watch } from "../../model";
import { Title } from "../Text";

const Finished = () => {
  const currentGame = watch(state.currentGame)!;
  const game = watch(state.games[currentGame])!;
  const playerId = watch(local.uid)!;

  if (game.gameState.type !== "finished") {
    return null;
  }

  const isSinglePlayerGame = Object.values(game.players).length === 1;
  const winningPlayer = game.gameState.winnerId;
  const youWin = winningPlayer === playerId;
  const numCorrect = game.numQuestions - game.options.startingLives;

  return (
    <>
      {winningPlayer == null ? (
        <Title>Draw!</Title>
      ) : (
        <>
          <Title>🎉</Title>

          {isSinglePlayerGame && <Title>{numCorrect} Correct</Title>}

          {!isSinglePlayerGame &&
            (youWin ? (
              <Title>You Win!</Title>
            ) : (
              <Title>{game.players[winningPlayer].name} Won!</Title>
            ))}
        </>
      )}
    </>
  );
};

export default Finished;
