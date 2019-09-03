import * as React from "react";
import styled from "styled-components";
import { CtaButton } from "../components/Button";
import { EmptyLink } from "../components/Link";

const Blurb = styled.h2`
  padding-top: 6rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Home = () => (
  <div>
    <Blurb>A trivia game to play with friends and family.</Blurb>
    <ButtonContainer>
      <CtaButton>
        <EmptyLink to="/join">Join Game</EmptyLink>
      </CtaButton>
      <CtaButton>
        <EmptyLink to="/create">Create Game</EmptyLink>
      </CtaButton>
    </ButtonContainer>
  </div>
);

export default Home;
