import * as React from "react";
import styled from "styled-components";
import Center from "../components/Center";
import Select from "../components/Select";
import { Title } from "../components/Text";
import { local, watch, state, dispatch } from "../model";
import Button from "../components/Button";
import { redirectGame } from "../actions";
import * as api from "../api";

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
  const createGameState = {
    selectedCategory: "",
    selectedDifficulty: "",
  };

  state.categories = await api.getCategories();
  createGameState.selectedCategory = state.categories[0];

  state.difficulties = await api.getDifficulties();
  createGameState.selectedDifficulty = state.difficulties[0];

  state.createGameState = createGameState;
};

const selectCategory = (category: string) => {
  state.createGameState!.selectedCategory = category;
};

const selectDifficulty = (difficulty: string) => {
  state.createGameState!.selectedDifficulty = difficulty;
};

const createGame = async () => {
  const createGameState = state.createGameState;

  if (createGameState == null || local.uid == null) {
    return;
  }

  const game = await api.createGame(local.uid, {
    selectedCategory: createGameState.selectedCategory,
    selectedDifficulty: createGameState.selectedDifficulty,
  });

  dispatch(redirectGame)(game.code);
};

const SelectGroup: React.FC<{
  name: string;
  options?: string[];
  value: string;
  onChange: (value: string) => void;
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
  const createGameState = watch(state.createGameState);

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
          console.log("creating game");
          dispatch(createGame)();
          e.preventDefault();
        }}
      >
        <SelectGroup
          value={createGameState.selectedCategory}
          onChange={dispatch(selectCategory)}
          name="Category"
          options={categories}
        />

        <SelectGroup
          value={createGameState.selectedDifficulty}
          onChange={dispatch(selectDifficulty)}
          name="Difficulty"
          options={difficulties}
        />

        <Button type="submit">Create</Button>
      </form>
    </Center>
  );
};

export default Create;
