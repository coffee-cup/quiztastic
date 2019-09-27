import * as React from "react";
import styled from "styled-components";
import * as actions from "../../actions";
import { dispatch, local, state, watch } from "../../model";
import Button from "../Button";
import Players from "../Players";
import { Blurb, Title } from "../Text";

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

  const player = game.players[playerId];
  const correct = game.gameState.correctPlayers[playerId];
  const isDead = player.lives <= 0;

  return (
    <>
      <Blurb>
        The answer was{" "}
        <Answer dangerouslySetInnerHTML={{ __html: game.gameState.answer }} />
      </Blurb>

      <Title>
        {isDead ? (
          <>
            ☠️ <br /> Game Over
          </>
        ) : correct ? (
          "👍"
        ) : (
          "👎"
        )}
      </Title>

      {<Button onClick={dispatch(actions.advanceRound)}>Next Question</Button>}

      <Players />
    </>
  );
};

export default Results;
