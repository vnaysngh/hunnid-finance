import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThirdwebProvider } from "thirdweb/react";
import { StateContextProvider } from "./context/index.tsx";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <StateContextProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </StateContextProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
