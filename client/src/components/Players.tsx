import * as React from "react";
import styled from "styled-components";
import { readyPlayer } from "../actions";
import { local, state, watch } from "../model";

const StyledPlayer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const PlayerName = styled.span<{ isYou: boolean; dim?: boolean }>`
  font-size: 2em;
  font-weight: bold;

  padding: 0 0.25rem;
  ${props => props.isYou && `background-color: ${props.theme.colours.yellow};`};
  ${props => props.dim && `opacity: 0.5;`};
`;

export const PlayerInfo = styled.span`
  font-size: 1.5em;
  font-weight: bold;
`;

const Player: React.FC<{ id: string }> = ({ id }) => {
  const currentGame = watch(state.currentGame)!;
  const gameState = watch(state.games[currentGame].gameState);

  const player = watch(state.games[currentGame].players[id]);
  const isYou = watch(local.uid)! === player.id;

  return (
    <StyledPlayer>
      <PlayerName
        isYou={isYou}
        dim={gameState.type === "asking" && gameState.playerAnswers[id] == null}
      >
        {player.name}
      </PlayerName>

      {gameState.type !== "asking" && (
        <PlayerInfo>{player.lives} lives</PlayerInfo>
      )}
    </StyledPlayer>
  );
};

const StyledPlayers = styled.div`
  text-align: left;
`;

const Players: React.FC<{ hideSelf?: boolean }> = props => {
  const currentGame = watch(state.currentGame)!;
  const players = watch(state.games[currentGame].players);
  const playerId = watch(local.uid)!;

  const readyPlayers = Object.values(players).filter(p => {
    if (props.hideSelf && p.id === playerId) {
      return false;
    }

    return p.ready && p.lives > 0;
  });

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
