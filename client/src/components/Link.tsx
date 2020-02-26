import { Link as ProdoLink } from "@prodo/route";
import styled from "styled-components";

export const Link = styled(ProdoLink)`
  color: white;
  text-decoration: underline;
  transition: opacity 150ms ease-in-out;

  &:hover {
    opacity: 0.6;
  }
`;

export const EmptyLink = styled(ProdoLink)`
  color: inherit;
  text-decoration: inherit;
`;
