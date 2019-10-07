import { Route, Switch } from "@prodo/route";
import * as React from "react";
import styled from "styled-components";
import * as actions from "./actions";
import Container from "./components/Container";
import Header from "./components/Header";
import { dispatch } from "./model";
import Create from "./pages/Create";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Join from "./pages/Join";
import NotFound from "./pages/NotFound";

const Page = styled.div`
  padding-bottom: 2rem;
  min-height: 100vh;
  color: ${props => props.theme.colours.text};
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
            <Switch>
              <Route path="/join" component={Join} />
              <Route path="/create" component={Create} />
              <Route path="/game/:code" component={Game} />

              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
      </Switch>
    </Page>
  );
};

export default App;
