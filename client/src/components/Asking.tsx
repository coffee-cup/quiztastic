import * as React from "react";
import { dispatch, state, watch } from "../model";
import { Blurb } from "./Text";
import Button from "./Button";
import * as actions from "../actions";

const Asking = () => {
  const currentGame = watch(state.currentGame)!;
  const game = watch(state.games[currentGame])!;

  if (game.gameState.type !== "asking") {
    return null;
  }

  return (
    <>
      <Blurb>{game.gameState.question}</Blurb>

      {game.gameState.possibleAnswers.map(q => (
        <Button key={q} onClick={() => dispatch(actions.answerQuestion)(q)}>
          {q}
        </Button>
      ))}
    </>
  );
};

export default Asking;
