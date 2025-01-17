import "assets/styles/index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Routers from "router";
import { AppProvider } from "contexts";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider>
      <Routers />
    </AppProvider>
  </React.StrictMode>
);
