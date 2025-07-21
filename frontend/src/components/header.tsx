"use client";

import WalletConnectButton from "@/components/wallet-connect-button";
import { usePrivy } from "@privy-io/react-auth";

export default function Header() {
  const { authenticated, user } = usePrivy();

  return (
    <header className="flex justify-between items-center p-4">
      <h1>SuperWager</h1>
      
      <div className="flex items-center gap-4">
        {authenticated && (
          <span>Welcome, {user?.email || 'Wallet User'}</span>
        )}
        <WalletConnectButton />
      </div>
    </header>
  );
}