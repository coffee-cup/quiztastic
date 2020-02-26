import * as React from "react";
import styled from "styled-components";
import { ExternalLink } from "./Link";

const StyledFooter = styled.footer`
  display: flex;
  padding: 2rem 1rem;
  margin-top: 0;
  font-size: 1.1em;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  white-space: pre;

  a {
    color: white;
    text-decoration: underline;
  }
`;

const Footer = () => (
  <StyledFooter>
    Made with ♥ by{" "}
    <ExternalLink href="https://jakerunzer.com">jake runzer</ExternalLink>
  </StyledFooter>
);

export default Footer;
