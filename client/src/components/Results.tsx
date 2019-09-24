import * as React from "react";
import styled from "styled-components";
import Players from "./Players";
import { local, dispatch, state, watch } from "../model";
import { Blurb } from "./Text";
import Button from "./Button";
import * as actions from "../actions";

const Answer = styled.span`
  display: block;
  padding-top: 0.5rem;
  font-size: 1.4em;
  color: ${props => props.theme.colours.purple};
`;

const Results = () => {
  const currentGame = watch(state.currentGame)!;
  const game = watch(state.games[currentGame])!;
  const playerId = watch(local.uid)!;

  if (game.gameState.type !== "results") {
    return null;
  }

  const isAdmin = game.admin === playerId;

  return (
    <>
      <Blurb>
        The answer was{" "}
        <Answer dangerouslySetInnerHTML={{ __html: game.gameState.answer }} />
      </Blurb>

      {isAdmin && (
        <Button onClick={dispatch(actions.advanceRound)}>Next Question</Button>
      )}

      <Players />
    </>
  );
};

export default Results;
