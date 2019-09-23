import * as React from "react";
import styled from "styled-components";
import { state, watch, local } from "../model";
import { readyPlayer } from "../actions";

const StyledPlayer = styled.div<{ ready: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const PlayerName = styled.span<{ isYou: boolean }>`
  font-size: 2em;
  font-weight: bold;

  padding: 0 0.25rem;
  ${props => props.isYou && `background-color: ${props.theme.colours.yellow}`}
`;

export const PlayerLives = styled.span`
  font-size: 1.5em;
  font-weight: bold;
`;

const Player: React.FC<{ id: string }> = ({ id }) => {
  const currentGame = watch(state.currentGame)!;
  const player = watch(state.games[currentGame].players[id]);
  const isYou = watch(local.uid)! === player.id;

  return (
    <StyledPlayer ready={player.ready}>
      <PlayerName isYou={isYou}>{player.name}</PlayerName>
      <PlayerLives>{player.lives} lives</PlayerLives>
    </StyledPlayer>
  );
};

const StyledPlayers = styled.div`
  padding-top: 1rem;
  text-align: left;
`;

const Players = () => {
  const currentGame = watch(state.currentGame)!;
  const players = watch(state.games[currentGame].players);
  const readyPlayers = Object.values(players).filter(p => p.ready);

  return (
    <StyledPlayers>
      {readyPlayers.map(p => (
        <Player key={p.id} id={p.id} />
      ))}

      {readyPlayer.length === 0 && <h4>No players ready</h4>}
    </StyledPlayers>
  );
};

export default Players;
