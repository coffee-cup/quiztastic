import * as React from "react";
import * as io from "socket.io-client";
import Players from "../components/Players";
import * as actions from "../actions";
import Button from "../components/Button";
import Center from "../components/Center";
import { FormGroup } from "../components/Form";
import Input from "../components/Input";
import { Title } from "../components/Text";
import { dispatch, local, state, watch } from "../model";
import { GameStatus } from "../types";

const GameInfo = (props: { code: string }) => (
  <FormGroup label="game code">
    <Title>{props.code}</Title>
  </FormGroup>
);

export interface Props {
  code: string;
}

const WaitingArea: React.FC = () => {
  const currentGame = watch(state.currentGame);

  if (currentGame == null) {
    return null;
  }

  const game = watch(state.games[currentGame]);
  const playerId = watch(local.uid);
  const localName = watch(local.name) || "";

  const [name, setName] = React.useState(localName);

  if (!game || !playerId) {
    return null;
  }

  const player = game.players[playerId];

  return (
    <div>
      <GameInfo code={game.code} />

      {!player.ready && (
        <FormGroup label="Your name">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />
          <Button onClick={() => dispatch(actions.readyPlayer)(name)}>
            Ready
          </Button>
        </FormGroup>
      )}

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

      <Players />
    </div>
  );
};

const InGame = () => {
  const currentGame = watch(state.currentGame);
  const game = currentGame != null && watch(state.games[currentGame]);

  if (game == null) {
    return null;
  }

  return <WaitingArea />;
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
        <InGame />
      )}
    </Center>
  );
};

export default Game;
