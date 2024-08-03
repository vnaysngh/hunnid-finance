import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MetaMaskProvider } from "@metamask/sdk-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "BlockPals",
          url: window.location.href
        }
      }}
    >
      <App />
    </MetaMaskProvider>
  </React.StrictMode>
);
