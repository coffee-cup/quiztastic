import * as React from "react";
import * as io from "socket.io-client";
import styled from "styled-components";
import * as actions from "../actions";
import Button from "../components/Button";
import Center from "../components/Center";
import { FormGroup } from "../components/Form";
import Input from "../components/Input";
import { Title } from "../components/Text";
import { dispatch, local, state, watch } from "../model";
import { GameStatus, Player as PlayerModel } from "../types";

const GameInfo = (props: { code: string }) => (
  <FormGroup label="game code">
    <Title>{props.code}</Title>
  </FormGroup>
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
  padding-top: 1rem;
  text-align: left;
`;

const Players: React.FC<{ players: PlayerModel[] }> = props => (
  <StyledPlayers>
    {props.players.map((p, i) => (
      <Player key={i} player={p} />
    ))}

    {props.players.length === 0 && <h4>No players ready</h4>}
  </StyledPlayers>
);

export interface Props {
  code: string;
}

const WaitingArea = () => {
  const game = watch(state.game);
  const playerId = watch(local.uid);
  const localName = watch(local.name) || "";

  const [name, setName] = React.useState(localName);

  if (!game) {
    return null;
  }

  const player = game.players.filter(p => p.id === playerId)[0];

  return (
    <div>
      <GameInfo code={game.code} />

      <FormGroup label="Your name">
        {player.ready ? (
          <Title>{player.name}</Title>
        ) : (
          <>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
            />
            <Button onClick={() => dispatch(actions.readyPlayer)(name)}>
              Ready
            </Button>
          </>
        )}
      </FormGroup>

      {player.ready && player.admin && (
        <FormGroup>
          <Button>Start game</Button>
        </FormGroup>
      )}

      {player.ready && !player.admin && (
        <FormGroup>
          <h4>{"Waiting for game to start... ヾ(￣0￣ )ノ"}</h4>
        </FormGroup>
      )}

      <Players players={game.players.filter(p => p.ready)} />
    </div>
  );
};

const Game = (props: Props) => {
  const gameStatus = watch(state.gameStatus);
  const playerId = watch(local.uid);
  const playerName = watch(local.name);

  if (!playerId) {
    return null;
  }

  React.useEffect(() => {
    const socket = io.connect("http://localhost:3000");

    actions.setupSocket(dispatch, socket);

    actions.joinGame(props.code, playerId, playerName);
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
