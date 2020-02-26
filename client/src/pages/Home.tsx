import * as React from "react";
import styled from "styled-components";
import { ButtonLink } from "../components/Button";
import Container from "../components/Container";
import { Blurb, Title } from "../components/Text";
import { Link, ExternalLink } from "../components/Link";
import Footer from "../components/Footer";

const StyledHome = styled.div``;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HomePageCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: calc(100vh);
  text-align: center;
`;

const AboutMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1rem;
  text-align: right;
  font-weight: bold;
`;

const Home = () => (
  <StyledHome>
    <Container>
      <HomePageCenter>
        <Title>Quiztastic!</Title>
        <Blurb>A trivia game to play with friends or family</Blurb>
        <ButtonContainer>
          <ButtonLink to="/join">Join Game</ButtonLink>
          <ButtonLink to="/create">Create Game</ButtonLink>
        </ButtonContainer>

        <AboutMessage>
          <Link to="/about">What is this?</Link>
          <ExternalLink href="https://opentdb.com/">
            Questions from Open Triva DB
          </ExternalLink>
        </AboutMessage>
      </HomePageCenter>
    </Container>

    <Footer />
  </StyledHome>
);

export default Home;
