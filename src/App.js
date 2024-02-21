import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useState, useEffect } from "react";
// import { GetitAdPlugin } from "get-tmp-package";
// import GetitAdPlugin from "./sdk";
import GetitAdPlugin from './sdk'
function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <div className="App">
      <Header
        connect={connect}
        disconnect={disconnect}
        isConnected={isConnected}
        address={address}
      />
      <GetitAdPlugin
        apiKey="JoIBr3NRNYImiL8qaRxlxXFaMjvxoaCBMN1OiAvKNYyclky8WixRnScHjLNPIZrANfMpvZvcepsWbjXbH9YxOeul17siKT9poug56wFmxlaLi3Xh2IYQoq167MYaPFbJ"
        walletConnected={address ? address : ""}
        isMobile={false}

        slotId="1"
      />
      <div className="mainWindow">
        <Swap isConnected={isConnected} address={address} />
      </div>
    </div>
  );
}

export default App;
