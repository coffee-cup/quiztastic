import * as React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import Center from "../components/Center";
import Input from "../components/Input";
import { Title } from "../components/Text";
import { GameStatus, Game as GameModel, Player as PlayerModel } from "../types";
import * as io from "socket.io-client";
import { watch, dispatch, state, local } from "../model";
import * as actions from "../actions";

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

export interface Props {
  code: string;
}

const WaitingArea = () => {
  const game = watch(state.game);

  if (!game) {
    return null;
  }

  return (
    <div>
      <GameInfo code={game.code} />
      <Input placeholder="Your name" value={"blah"} />
      <Button>Ready</Button>
      <Players players={game.players} />
    </div>
  );
};

const Game = (props: Props) => {
  const gameStatus = watch(state.gameStatus);
  const playerId = watch(local.uid);

  if (!playerId) {
    return null;
  }

  React.useEffect(() => {
    const socket = io.connect("http://localhost:3000");

    socket.on("game", ({ game }: { game: GameModel }) => {
      dispatch(actions.setGame)(game);
    });

    socket.on("game info", ({ message }: { message: string }) => {
      dispatch(actions.setError)(message);
    });

    socket.emit("join game", {
      code: props.code,
      id: playerId,
    });
  }, [props.code]);

  return (
    <Center>
      {gameStatus === GameStatus.loading ? (
        <h1>Loading...</h1>
      ) : gameStatus === GameStatus.notFound ? (
        <h1>{"Game not found D:"}</h1>
      ) : gameStatus === GameStatus.notJoinable ? (
        <h1>Game has already started</h1>
      ) : (
        <WaitingArea />
      )}
    </Center>
  );
};

export default Game;
