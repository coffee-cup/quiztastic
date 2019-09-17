import * as React from "react";
import styled from "styled-components";
import { ButtonLink } from "../components/Button";
import Center from "../components/Center";
import Container from "../components/Container";
import { Blurb, Title } from "../components/Text";

const StyledHome = styled.div``;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Home = () => (
  <StyledHome>
    <Container>
      <Center>
        <Title>Quiztastic !</Title>
        <Blurb>A trivia game to play with friends and family</Blurb>
        <ButtonContainer>
          <ButtonLink to="/join">Join Game</ButtonLink>
          <ButtonLink to="/ready">Create Game</ButtonLink>
        </ButtonContainer>
      </Center>
    </Container>
  </StyledHome>
);

export default Home;
