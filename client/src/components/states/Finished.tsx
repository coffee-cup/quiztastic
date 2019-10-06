import * as React from "react";
import { dispatch, local, state, watch } from "../../model";
import { Title } from "../Text";
import styled from "styled-components";
import GameOptions from "../GameOptions";
import * as actions from "../../actions";

const StyledFinished = styled.div``;

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

  const ShowResults = () => (
    <>
      {isSinglePlayerGame && <Title>{numCorrect} Correct</Title>}

      {!isSinglePlayerGame &&
        (youWin ? (
          <Title>You Win!</Title>
        ) : (
          <Title>{game.players[winningPlayer].name} Won!</Title>
        ))}
    </>
  );

  return (
    <StyledFinished>
      <Title>🎉</Title>

      <ShowResults />

      <p>Play again?</p>
      <GameOptions
        buttonTitle="Start"
        onSubmit={() => dispatch(actions.restartGame)(game.code)}
      />
    </StyledFinished>
  );
};

export default Finished;
