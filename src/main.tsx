import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@telefonica/mistica/css/mistica.css";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

import {
  ThemeContextProvider,
  getVivoSkin,
  ThemeConfig,
} from "@telefonica/mistica";

const theme: ThemeConfig = {
  skin: getVivoSkin(),
  i18n: {
    locale: 'pt-BR',
    phoneNumberFormattingRegionCode: 'BR',
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider theme={theme}>
      <App />
    </ThemeContextProvider>
  </React.StrictMode>
);
