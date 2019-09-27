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

  const winningPlayer = game.gameState.winnerId;

  const youWin = winningPlayer === playerId;

  return (
    <>
      {winningPlayer == null ? (
        <Title>Draw!</Title>
      ) : (
        <>
          <Title>🎉</Title>

          {youWin ? (
            <Title>You Win!</Title>
          ) : (
            <Title>{game.players[winningPlayer].name} Won!</Title>
          )}
        </>
      )}
    </>
  );
};

export default Finished;
