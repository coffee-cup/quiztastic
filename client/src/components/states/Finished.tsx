import * as React from "react";
import styled from "styled-components";
import * as actions from "../../actions";
import { dispatch, local, state, watch } from "../../model";
import GameOptions from "../GameOptions";
import { Answer, Title } from "../Text";

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
  const isAdmin = game.admin === playerId;

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

      <Answer answer={game.gameState.correctAnswer} />

      {isAdmin && (
        <>
          <p>Play again?</p>
          <GameOptions
            buttonTitle="Start"
            onSubmit={() => dispatch(actions.restartGame)(game.code)}
          />
        </>
      )}
    </StyledFinished>
  );
};

export default Finished;
