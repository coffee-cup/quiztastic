import * as React from "react";
import { FormGroup } from "./Form";
import Button from "./Button";
import { Title } from "./Text";
import Input from "./Input";
import Players from "./Players";
import { dispatch, state, watch, local } from "../model";
import * as actions from "../actions";

const GameInfo = (props: { code: string }) => (
  <FormGroup label="game code">
    <Title>{props.code}</Title>
  </FormGroup>
);

const WaitingRoom = () => {
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
          <Button onClick={() => dispatch(actions.startGame)()}>
            Start game
          </Button>
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

export default WaitingRoom;
