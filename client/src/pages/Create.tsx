import * as React from "react";
import * as actions from "../actions";
import Center from "../components/Center";
import GameOptions from "../components/GameOptions";
import { Title } from "../components/Text";
import { dispatch } from "../model";

const Create = () => {
  return (
    <Center>
      <Title>Create Game</Title>

      <GameOptions
        buttonTitle="Create"
        onSubmit={dispatch(actions.createGame)}
      />
    </Center>
  );
};

export default Create;
