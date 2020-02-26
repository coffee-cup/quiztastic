import * as React from "react";
import styled from "styled-components";
import { ButtonLink } from "../components/Button";
import { Title } from "../components/Text";
import Center from "../components/Center";
import { ExternalLink } from "../components/Link";
import Footer from "../components/Footer";

const StyledAbout = styled.div``;

const Message = styled.p`
  font-size: 1.1em;
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
          Everyone connects to the same game and starts with the same amount of
          lives. If you get a question incorrect, you lose a life. The last one
          remaining wins. You can also play by yourself and see how many
          questions you can answer correctly before running out of lives.
        </Message>

        <Message>
          All questions come from the{" "}
          <ExternalLink href="https://opentdb.com/">
            Open Trivia Database
          </ExternalLink>
          .
        </Message>

        <Message>
          The source code for this site can be found on{" "}
          <ExternalLink href="https://github.com/coffee-cup/quiztastic/">
            Github
          </ExternalLink>
          .
        </Message>

        <ButtonLink to="/">Play</ButtonLink>
      </LeftAligned>
    </Center>

    <Footer />
  </StyledAbout>
);

export default About;
