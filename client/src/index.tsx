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

const { Provider } = model.createStore({
  logger: true,
  initState: {
    gameStatus: GameStatus.loading,
  },
  route: {
    history,
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById("root"),
);
