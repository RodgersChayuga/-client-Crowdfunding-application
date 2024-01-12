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

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        coinbaseWallet(),
        walletConnect(),
      ]}
      activeChain={Sepolia}
      clientId={process.env.THIRDWEB_CLIENT_ID}
    >
      <Router>
        <App />
      </Router>
    </ThirdwebProvider>
  );
} else {
  console.error("Root element not found");
}
