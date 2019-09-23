import * as React from "react";
import { dispatch, state, watch, local } from "../model";
import { Blurb } from "./Text";
import Center from "./Center";
import Button from "./Button";
import * as actions from "../actions";

const Asking = () => {
  const currentGame = watch(state.currentGame)!;
  const game = watch(state.games[currentGame])!;

  if (game.gameState.type !== "asking") {
    return null;
  }

  return (
    <Center>
      <Blurb>{game.gameState.question}</Blurb>

      {game.gameState.possibleAnswers.map(q => (
        <Button key={q}>{q}</Button>
      ))}
    </Center>
  );
};

export default Asking;
