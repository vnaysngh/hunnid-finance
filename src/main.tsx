import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThirdwebProvider } from "thirdweb/react";
import { StateContextProvider } from "./context/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
