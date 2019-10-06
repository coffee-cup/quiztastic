import * as React from "react";
import Center from "../components/Center";
import { Title } from "../components/Text";
import { dispatch } from "../model";
import GameOptions from "../components/GameOptions";
import * as actions from "../actions";

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
