import * as React from "react";
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

const StyledExternalLink = styled.a`
  color: white;
  text-decoration: underline;
  transition: opacity 150ms ease-in-out;

  &:hover {
    opacity: 0.6;
  }
`;

export const ExternalLink: React.FC<{ href: string }> = ({
  href,
  children,
}) => (
  <StyledExternalLink href={href} target="_blank" rel="noopener">
    {children}
  </StyledExternalLink>
);
