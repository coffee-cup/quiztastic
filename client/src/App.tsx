import * as React from "react";
import { Route, Switch } from "@prodo/route";
import styled from "styled-components";
import Container from "./components/Container";
import Header from "./components/Header";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Game from "./pages/Game";
import Create from "./pages/Create";
import { dispatch } from "./model";
import * as actions from "./actions";

const Page = styled.div`
  color: ${props => props.theme.colours.text};
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    ${props => props.theme.colours.pink},
    ${props => props.theme.colours.orange}
  );
`;

const App = () => {
  React.useEffect(() => {
    dispatch(actions.ensurePlayerUid)();
  }, []);

  return (
    <Page>
      <Switch>
        <Route exact path="/" component={Home} />

        <>
          <Header />
          <Container>
            <Route path="/join" component={Join} />
            <Route path="/create" component={Create} />
            <Route path="/game/:code" component={Game} />
          </Container>
        </>
      </Switch>
    </Page>
  );
};

export default App;
