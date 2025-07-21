"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export default function WalletConnectButton() {
  const { ready, authenticated, user, login, logout, connectWallet, linkWallet } = usePrivy();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !ready) {
    return (
      <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
        Loading...
      </button>
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Connect Wallet
      </button>
    );
  }

  const handleConnectAdditionalWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect additional wallet:", error);
    }
  };

  const handleLinkWallet = async () => {
    try {
      await linkWallet();
    } catch (error) {
      console.error("Failed to link wallet:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          Connected
        </div>
        <span className="text-sm text-gray-600">
          {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleConnectAdditionalWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Add Wallet
        </button>
        
        <button
          onClick={handleLinkWallet}
          className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Link Wallet
        </button>
        
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}