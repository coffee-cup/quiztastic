import * as React from "react";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";

const StyledFormGroup = styled.div`
  text-align: left;
  padding-bottom: 1rem;

  > :last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.span`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 1em;
  text-align: left;
`;

export const FormGroup: React.FC<{
  label?: string;
  className?: string;
}> = props => (
  <StyledFormGroup className={props.className}>
    {props.label && <Label>{props.label}</Label>}
    {props.children}
  </StyledFormGroup>
);

const StyledInputButtonGroup = styled(FormGroup)`
  display: flex;
  align-items: center;

  input {
    flex-grow: 1;
  }

  button {
    height: auto;
    width: auto;
    min-width: auto;
  }
`;

export const InputButtonGroup: React.FC<{
  buttonText: string;
  placeholder: string;
  value: string;
  labelText?: string;
  onChange?: (value: string) => void;
}> = props => {
  const [value, setValue] = React.useState(props.value);

  return (
    <FormGroup label={props.labelText}>
      <StyledInputButtonGroup>
        <Input
          placeholder={props.placeholder}
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
        />
        <Button
          disabled={value !== ""}
          onClick={() => props.onChange && props.onChange(value)}
        >
          {props.buttonText}
        </Button>
      </StyledInputButtonGroup>
    </FormGroup>
  );
};
