import * as React from "react";
import styled from "styled-components";
import { redirectGame } from "../actions";
import * as api from "../api";
import Button from "../components/Button";
import Center from "../components/Center";
import Select from "../components/Select";
import { Title } from "../components/Text";
import { dispatch, local, state, watch } from "../model";
import { GameOptions } from "../types";

const Group = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 1rem;
`;

const Label = styled.h3`
  margin-bottom: 0;
  padding-right: 1rem;
`;

const startCreateGame = async () => {
  const gameOptions: GameOptions = {
    category: "",
    difficulty: "",
    startingLives: 3,
  };

  state.categories = await api.getCategories();
  gameOptions.category = state.categories[0];

  state.difficulties = await api.getDifficulties();
  gameOptions.difficulty = state.difficulties[0];

  state.createGameOptions = gameOptions;
};

const selectCategory = (category: string) => {
  state.createGameOptions!.category = category;
};

const selectDifficulty = (difficulty: string) => {
  state.createGameOptions!.difficulty = difficulty;
};

const selectStartingLives = (lives: number) => {
  state.createGameOptions!.startingLives = lives;
};

const createGame = async () => {
  const createGameOptions = state.createGameOptions;

  if (createGameOptions == null || local.uid == null) {
    return;
  }

  const game = await api.createGame(local.uid, createGameOptions);

  dispatch(redirectGame)(game.code);
};

const SelectGroup: React.FC<{
  name: string;
  options?: any[];
  value: any;
  onChange: (value: any) => void;
}> = ({ name, options, value, onChange }) =>
  options != null ? (
    <Group>
      <Label>{name}</Label>
      <Select
        value={value}
        name={name}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
    </Group>
  ) : null;

const Create = () => {
  const categories = watch(state.categories);
  const difficulties = watch(state.difficulties);
  const createGameState = watch(state.createGameOptions);

  React.useEffect(() => {
    dispatch(startCreateGame)();
  }, []);

  if (createGameState == null) {
    return null;
  }

  return (
    <Center>
      <Title>Create Game</Title>
      <form
        onSubmit={e => {
          dispatch(createGame)();
          e.preventDefault();
        }}
      >
        <SelectGroup
          value={createGameState.category}
          onChange={dispatch(selectCategory)}
          name="Category"
          options={categories}
        />

        <SelectGroup
          value={createGameState.difficulty}
          onChange={dispatch(selectDifficulty)}
          name="Difficulty"
          options={difficulties}
        />

        <SelectGroup
          value={createGameState.startingLives}
          onChange={dispatch(selectStartingLives)}
          name="Starting Lives"
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        />

        <Button type="submit">Create</Button>
      </form>
    </Center>
  );
};

export default Create;
