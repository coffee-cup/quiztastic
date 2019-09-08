import * as React from "react";
import styled from "styled-components";
import { EmptyLink } from "./Link";

const Button = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.15rem;
  padding: 0.5rem;
  width: 100%;
  min-width: 16rem;
  height: 3rem;
  background-color: ${props => props.theme.colours.purple};
  border: none;
  color: white;
  border-radius: 2px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 250ms ease-in-out;

  &:active {
    transform: scale(1.1);
  }
`;

export default Button;

const AnyButton = Button as any;
export const ButtonLink: React.FC<{ to: string }> = props => (
  <AnyButton as={EmptyLink} to={props.to}>
    {props.children}
  </AnyButton>
);
