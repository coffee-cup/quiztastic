import * as React from "react";
import styled from "styled-components";
import * as actions from "../actions";
import { dispatch, state, watch } from "../model";
import Button from "./Button";
import Select from "./Select";

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

const GameOptions: React.FC<{
  buttonTitle: string;
  onSubmit: () => void;
}> = props => {
  React.useEffect(() => {
    dispatch(actions.startCreateGame)();
  }, []);

  const categories = watch(state.categories);
  const difficulties = watch(state.difficulties);
  const createGameState = watch(state.createGameOptions);

  if (createGameState == null) {
    return null;
  }

  return (
    <form
      onSubmit={e => {
        props.onSubmit();
        e.preventDefault();
      }}
    >
      <SelectGroup
        value={createGameState.category}
        onChange={dispatch(actions.selectCategory)}
        name="Category"
        options={categories}
      />
      <SelectGroup
        value={createGameState.difficulty}
        onChange={dispatch(actions.selectDifficulty)}
        name="Difficulty"
        options={difficulties}
      />
      <SelectGroup
        value={createGameState.startingLives}
        onChange={value =>
          dispatch(actions.selectStartingLives)(parseInt(value, 10))
        }
        name="Starting Lives"
        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      />
      <Button type="submit">{props.buttonTitle}</Button>
    </form>
  );
};

export default GameOptions;
