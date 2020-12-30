import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { model } from "./model";
import { theme } from "./styles";
import typography from "./styles/typography";
import { GameStatus } from "./types";

import "./index.scss";

typography.injectStyles();

const history = createBrowserHistory();

const isProduction = process.env.NODE_ENV === "production";

const { Provider } = model.createStore({
  logger: !isProduction,
  initState: {
    gameStatus: GameStatus.loading,
    currentGame: null,
    games: {},
  },
  route: {
    history,
  },
});

const render = () =>
  ReactDOM.render(
    <Provider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>,
    document.getElementById("root"),
  );

if (module.hot) {
  module.hot.accept("./App", () => {
    render();
  });
}

render();
