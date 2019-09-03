import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import typography from "./styles/typography";

import "./index.scss";

typography.injectStyles();

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root"),
);
