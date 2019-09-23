import * as React from "react";
import * as io from "socket.io-client";
import * as actions from "../actions";
import Center from "../components/Center";
import { dispatch, local, state, watch } from "../model";
import { GameStatus } from "../types";
import WaitingRoom from "../components/WaitingRoom";
import Asking from "../components/Asking";

export interface Props {
  code: string;
}

const InGame = () => {
  const currentGame = watch(state.currentGame);

  if (currentGame == null) {
    return null;
  }

  const game = watch(state.games[currentGame]);

  if (game == null) {
    return null;
  }

  if (game.gameState.type === "waiting") {
    return <WaitingRoom />;
  } else if (game.gameState.type === "asking") {
    return <Asking />;
  }

  return null;
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
