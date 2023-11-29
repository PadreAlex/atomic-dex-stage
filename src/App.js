import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import GetitAdPlugin from "./sdk";
import { useState } from "react";

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
        apiKey="DhoFm82C6XN2bbs3tnuGTIVF3IHedbNhYl5dqoCZVrrKajMePFbpLUZtd4LO17xbh36NjLbNZynbvri3OzOwiMfwJIjVH20Le2QdhS71QEpxJ71Hj7zZf1M1r0qbaZCx"
        walletConnected={address ? address : ""}
        isMobile={false}
      />
      <div className="mainWindow">
        <Routes>
          <Route
            path="/atomic-dex/swap"
            element={<Swap isConnected={isConnected} address={address} />}
          />
          <Route path="/atomic-dex/tokens" element={<Tokens />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;