import { Link } from "@prodo/route";
import * as React from "react";
import styled from "styled-components";
import { HeaderHeight } from "../styles";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${HeaderHeight}px;
  background-color: ${props => props.theme.colours.purple};
  margin-top: 0;
  font-size: 1.5em;
  font-weight: bold;

  a {
    color: white;
    text-decoration: none;
  }
`;

const Header = () => (
  <StyledHeader>
    <Link to="/">Quiztastic!</Link>
  </StyledHeader>
);

export default Header;
