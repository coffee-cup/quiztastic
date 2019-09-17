import * as React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import Center from "../components/Center";
import Input from "../components/Input";
import { Title } from "../components/Text";
import { Player as PlayerModel } from "../types";

const StyledGameInfo = styled.div`
  text-align: left;
  margin 0 auto;

  .info {
    font-size: 0.9em;
  }

  .code {
    font-size: 2.5em;
  }
`;

const GameInfo = (props: { code: string }) => (
  <StyledGameInfo>
    <div className="info">game code</div>
    <Title>{props.code}</Title>
  </StyledGameInfo>
);

const StyledPlayer = styled.div<{ ready: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h3 {
    margin-bottom: 0;
  }

  .ready {
    padding: 0 0.5rem;
    background-color: ${props =>
      props.ready ? "transparent" : props.theme.colours.yellow};
  }
`;

const Player: React.FC<{ player: PlayerModel }> = ({ player }) => (
  <StyledPlayer ready={player.ready}>
    <h3>{player.name}</h3>
    <span className="ready">{player.ready ? "ready" : "not ready"}</span>
  </StyledPlayer>
);

const StyledPlayers = styled.div`
  padding-top: 2rem;
  text-align: left;
`;

const Players: React.FC<{ players: PlayerModel[] }> = props => (
  <StyledPlayers>
    {props.players.map((p, i) => (
      <Player key={i} player={p} />
    ))}
  </StyledPlayers>
);

const players: PlayerModel[] = [
  { name: "Jake", lives: 3, ready: true },
  { name: "Aleesha", lives: 3, ready: true },
  { name: "Gab", lives: 3, ready: false },
];

const Ready = () => (
  <Center>
    <GameInfo code="ABCDEF" />
    <Input placeholder="Your name" />
    <Button>Ready</Button>
    <Players players={players} />
  </Center>
);

export default Ready;
