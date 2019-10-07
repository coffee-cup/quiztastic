import * as React from "react";
import styled from "styled-components";

export const Title = styled.h1`
  font-size: 3.5em;
  margin-bottom: 1.5rem;
`;

export const Blurb = styled.h2`
  margin-right: auto;
  margin-left: auto;
  max-width: 18ch;
  margin-top: 0;
`;

const Result = styled.span`
  display: block;
  padding-top: 0.5rem;
  font-size: 1.4em;
  color: ${props => props.theme.colours.purple};
`;

export const Answer: React.FC<{ answer: string }> = props => (
  <Blurb>
    The answer was <Result dangerouslySetInnerHTML={{ __html: props.answer }} />
  </Blurb>
);
