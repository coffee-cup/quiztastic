import * as React from "react";
import { FormGroup } from "./Form";
import Button from "./Button";
import Input from "./Input";
import Players from "./Players";
import { dispatch, state, watch, local } from "../model";
import * as actions from "../actions";

const GameInfo: React.FC<{
  code: string;
  category: string;
  difficulty: string;
}> = props => (
  <div>
    <FormGroup label="game code">
      <h1>{props.code}</h1>
    </FormGroup>
    <FormGroup label="category">
      <h1>{props.category}</h1>
    </FormGroup>
    <FormGroup label="difficulty">
      <h1>{props.difficulty}</h1>
    </FormGroup>
  </div>
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
      <GameInfo
        code={game.code}
        category={game.options.category}
        difficulty={game.options.difficulty}
      />

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
