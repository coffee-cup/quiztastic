import * as React from "react";
import styled from "styled-components";
import * as actions from "../actions";
import Center from "../components/Center";
import Container from "../components/Container";
import Loading from "../components/Loading";
import { Title } from "../components/Text";
import { dispatch, state, watch } from "../model";

const StyledAdmin = styled.div``;

const GameCodesList = styled.div`
  text-align: left;
`;

const Admin = () => {
  React.useEffect(() => {
    dispatch(actions.getAllGameCodes)();
  }, []);

  const gameCodes = watch(state.gameCodes);

  return (
    <StyledAdmin>
      <Container>
        <Center>
          <Title>Admin</Title>

          {gameCodes == null ? (
            <Loading />
          ) : (
            <GameCodesList>
              <h2>{gameCodes.length} open games</h2>
              <hr />
              {gameCodes.map(code => (
                <h2 key={code}>{code}</h2>
              ))}
            </GameCodesList>
          )}
        </Center>
      </Container>
    </StyledAdmin>
  );
};

export default Admin;
