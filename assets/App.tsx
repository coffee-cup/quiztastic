import * as React from "react";
import Header from "./components/Header";
import styled from "styled-components";
import { Switch, Route } from "react-router";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Create from "./pages/Create";
import Ready from "./pages/Ready";

const Page = styled.div``;

const Container = styled.main`
  padding: 0 0.5rem;
`;

const App = () => (
  <Page>
    <Header />

    <Container>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/create" component={Create} />
        <Route path="/join" component={Join} />
        <Route path="/ready" component={Ready} />
      </Switch>
    </Container>
  </Page>
);

export default App;
