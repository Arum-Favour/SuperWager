"use client";

import { somniaChain } from "@/utils/privy/chain";
import { PrivyProvider as Privy } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          accentColor: "#0080ff",
          theme: "#fff",
          showWalletLoginFirst: true,
          logo: "/Superwager.png",
          // Explicitly specify wallet list to prioritize browser extension
          walletList: [
            "detected_wallets", // This will detect MetaMask browser extension first
            "metamask", // Explicit MetaMask support
            "coinbase_wallet",
            // Remove wallet_connect from the list to avoid conflicts
          ],
        },
        loginMethods: [
          "wallet", // Enable external wallet connections
          "email",
        ],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
        },
        // Simplified external wallet config - remove WalletConnect to avoid conflicts
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
          coinbaseWallet: {
            connectionOptions: "eoaOnly",
          },
        },
        defaultChain: somniaChain,
        supportedChains: [somniaChain],
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      {children}
    </Privy>
  );
}
