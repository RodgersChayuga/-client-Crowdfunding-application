import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import {
  ThirdwebProvider,
  useContract,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

import App from "./App";
import "./index.css";
import { StateContextProvider } from "./context";

const rootElement = document.getElementById("root");
const sepolia = Sepolia;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ThirdwebProvider
      activeChain={sepolia}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <StateContextProvider>
        <Router>
          <App />
        </Router>
      </StateContextProvider>
    </ThirdwebProvider>
  );
} else {
  console.error("Root element not found");
}
