import * as React from "react";
import { Route, Switch } from "react-router";
import styled from "styled-components";
import Container from "./components/Container";
import Header from "./components/Header";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Ready from "./pages/Ready";

const Page = styled.div`
  color: ${props => props.theme.colours.text};
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    ${props => props.theme.colours.pink},
    ${props => props.theme.colours.orange}
  );
`;

const App = () => (
  <Page>
    <Switch>
      <Route exact path="/" component={Home} />

      <>
        <Header />
        <Container>
          <Route path="/join" component={Join} />
          <Route path="/ready" component={Ready} />
        </Container>
      </>
    </Switch>
  </Page>
);

export default App;
