import * as React from "react";
import styled from "styled-components";
import * as actions from "../../actions";
import { dispatch, local, state, watch } from "../../model";
import { AnimatedButton } from "../Button";
import Players from "../Players";
import { Title } from "../Text";

const Question = styled.p`
  margin-top: 0;
  font-size: 1.2em;
  text-align: left;
`;

const Asking = () => {
  const currentGame = watch(state.currentGame)!;
  const game = watch(state.games[currentGame])!;
  const playerId = watch(local.uid)!;

  if (game.gameState.type !== "asking") {
    return null;
  }

  const userAnswer = game.gameState.playerAnswers[playerId];
  const isDead = game.players[playerId].lives <= 0;

  return (
    <>
      <Title>Question {game.numQuestions}</Title>
      <Question dangerouslySetInnerHTML={{ __html: game.gameState.question }} />

      {isDead && <h2>☠️ You are dead and cannot answer ☠️</h2>}

      {game.gameState.possibleAnswers.map((q, i) => (
        <AnimatedButton
          key={q}
          delay={i}
          disabled={isDead}
          onClick={() => dispatch(actions.answerQuestion)(q)}
          selected={userAnswer != null && userAnswer === q}
        >
          <span dangerouslySetInnerHTML={{ __html: q }} />
        </AnimatedButton>
      ))}

      <Players hideSelf />
    </>
  );
};

export default Asking;
