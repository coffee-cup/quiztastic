import * as React from "react";
import styled from "styled-components";
import * as actions from "../../actions";
import { dispatch, local, state, watch } from "../../model";
import Button from "../Button";
import { FormGroup } from "../Form";
import Input from "../Input";
import Players from "../Players";

const StyledGameInfo = styled.div`
  padding-bottom: 1rem;
`;

const GameInfo: React.FC<{
  code: string;
  category: string;
  difficulty: string;
}> = props => (
  <StyledGameInfo>
    <FormGroup label="game code">
      <h1>{props.code}</h1>
    </FormGroup>
    <FormGroup label="category">
      <h1>{props.category}</h1>
    </FormGroup>
    <FormGroup label="difficulty">
      <h1>{props.difficulty}</h1>
    </FormGroup>
  </StyledGameInfo>
);

const StyledWaitingRoom = styled.div`
  text-align: left;
`;

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
    <StyledWaitingRoom>
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
        <h3>{"Waiting for game to start... ヾ(￣0￣ )ノ"}</h3>
      )}

      <FormGroup label="players">
        <Players />
      </FormGroup>
    </StyledWaitingRoom>
  );
};

export default WaitingRoom;
