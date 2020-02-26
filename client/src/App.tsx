import { Route, Switch } from "@prodo/route";
import * as React from "react";
import styled from "styled-components";
import * as actions from "./actions";
import * as api from "./api";
import Container from "./components/Container";
import Header from "./components/Header";
import { dispatch } from "./model";
import Admin from "./pages/Admin";
import Create from "./pages/Create";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Join from "./pages/Join";
import NotFound from "./pages/NotFound";
import About from "./pages/About";

const Page = styled.div`
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

  // ensure server is alive
  React.useEffect(() => {
    const ping = async () => {
      await api.ping();
      setTimeout(ping, 10000);
    };
    ping();
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
              <Route path="/admin" component={Admin} />
              <Route path="/about" component={About} />

              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
      </Switch>
    </Page>
  );
};

export default App;
