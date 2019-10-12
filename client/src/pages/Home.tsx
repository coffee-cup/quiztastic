import * as React from "react";
import styled from "styled-components";
import { ButtonLink } from "../components/Button";
import Container from "../components/Container";
import { Blurb, Title } from "../components/Text";

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

const Home = () => (
  <StyledHome>
    <Container>
      <HomePageCenter>
        <Title>Quiztastic!</Title>
        <Blurb>A trivia game to play with friends and family</Blurb>
        <ButtonContainer>
          <ButtonLink to="/join">Join Game</ButtonLink>
          <ButtonLink to="/create">Create Game</ButtonLink>
        </ButtonContainer>
      </HomePageCenter>
    </Container>
  </StyledHome>
);

export default Home;
