import styled from "styled-components";

const Button = styled.button`
  appearance: none;
  margin: 0.15rem;
  height: 3rem;
  background-color: ${props => props.theme.colours.accent};
  border: none;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 250ms ease-in-out;

  &:active {
    transform: scale(1.1);
  }
`;

export default Button;

export const CtaButton = styled(Button)`
  min-width: 16rem;
`;
