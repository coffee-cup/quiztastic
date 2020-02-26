import * as React from "react";
import styled from "styled-components";
import { ButtonLink } from "../components/Button";
import { Title } from "../components/Text";
import Center from "../components/Center";

const StyledAbout = styled.div``;

const Message = styled.p`
  font-size: 1.1em;
`;

const ExternalLink = styled.a`
  color: white;
  text-decoration: underline;
  transition: opacity 150ms ease-in-out;

  &:hover {
    opacity: 0.6;
  }
`;

const LeftAligned = styled.div`
  text-align: left;
`;

const About = () => (
  <StyledAbout>
    <Center>
      <LeftAligned>
        <Title>About</Title>

        <Message>
          Quiztastic is trivia game designed to be played with multiple people.
          Everyone connects to the same game starts with the same amount of
          lives. If you get a question incorrect, you lose a life. The last one
          remaining wins.You can also play by yourself and see how many
          questions you can answer correctly before running out of lives.
        </Message>

        <Message>
          All questions come from the{" "}
          <ExternalLink
            href="https://opentdb.com/"
            target="_blank"
            rel="noopener"
          >
            Open Trivia Database
          </ExternalLink>
          .
        </Message>

        <ButtonLink to="/">Play</ButtonLink>
      </LeftAligned>
    </Center>
  </StyledAbout>
);

export default About;
