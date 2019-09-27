import * as React from "react";
import * as io from "socket.io-client";
import * as actions from "../actions";
import Asking from "../components/states/Asking";
import Center from "../components/Center";
import Results from "../components/states/Results";
import Loading from "../components/states/Loading";
import WaitingRoom from "../components/states/WaitingRoom";
import { dispatch, local, state, watch } from "../model";
import { GameStatus } from "../types";

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
  } else if (game.gameState.type === "results") {
    return <Results />;
  } else if (game.gameState.type === "loading") {
    return <Loading />;
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
    dispatch(actions.joinGame)(props.code, playerName);
  }, [props.code]);

  return (
    <Center>
      {gameStatus === GameStatus.loading ? (
        <Loading />
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
