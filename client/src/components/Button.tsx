import * as React from "react";
import styled from "styled-components";
import { EmptyLink } from "./Link";

const Button = styled.button<{ selected?: boolean }>`
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.15rem;
  padding: 0.5rem 1rem;
  width: 100%;
  min-width: 16rem;
  background-color: ${props =>
    props.selected ? props.theme.colours.yellow : props.theme.colours.purple};
  border: none;
  color: white;
  border-radius: 2px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 250ms ease-in-out;

  &:disabled {
    background-color: lightgrey;
  }

  &:active {
    ${props => !props.disabled && "transform: scale(1.1);"};
  }
`;

export default Button;

const AnyButton = Button as any;
export const ButtonLink: React.FC<{ to: string }> = props => (
  <AnyButton as={EmptyLink} to={props.to} {...props}>
    {props.children}
  </AnyButton>
);

export const AnimatedButton = styled(Button)<{ delay?: number }>`
  animation-name: slideIn;
  animation-duration: 150ms;
  animation-timing-function: ease-in-out;
  animation-delay: ${props => (props.delay || 0) * 100}ms;
  animation-fill-mode: forwards;

  opacity: 0;
  transform: translate(-100%);

  @keyframes slideIn {
    0% {
      opacity: 1;
      transform: translate(-150%);
    }
    100% {
      opacity: 1;
      transform: translate(0);
    }
  }
`;
