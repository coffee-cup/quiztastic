import * as React from "react";
import { local, dispatch, state, watch } from "../model";
import { Blurb } from "./Text";
import Button from "./Button";
import * as actions from "../actions";
import Players from "./Players";

const Asking = () => {
  const currentGame = watch(state.currentGame)!;
  const game = watch(state.games[currentGame])!;
  const playerUid = watch(local.uid)!;

  if (game.gameState.type !== "asking") {
    return null;
  }

  const userAnswer = game.gameState.playerAnswers[playerUid];

  return (
    <>
      <Blurb>{game.gameState.question}</Blurb>

      {game.gameState.possibleAnswers.map(q => (
        <Button
          key={q}
          onClick={() => dispatch(actions.answerQuestion)(q)}
          selected={userAnswer != null && userAnswer === q}
        >
          {q}
        </Button>
      ))}

      <Players hideSelf />
    </>
  );
};

export default Asking;
