import * as React from "react";
import styled from "styled-components";
import { local, dispatch, state, watch } from "../model";
import Button from "./Button";
import { Title } from "./Text";
import * as actions from "../actions";
import Players from "./Players";

const Question = styled.p`
  margin-top: 0;
  font-size: 1.2em;
  text-align: left;
`;

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
      <Title>Question {game.numQuestions}</Title>
      <Question dangerouslySetInnerHTML={{ __html: game.gameState.question }} />

      {game.gameState.possibleAnswers.map(q => (
        <Button
          key={q}
          onClick={() => dispatch(actions.answerQuestion)(q)}
          selected={userAnswer != null && userAnswer === q}
        >
          <span dangerouslySetInnerHTML={{ __html: q }} />
        </Button>
      ))}

      <Players hideSelf />
    </>
  );
};

export default Asking;
