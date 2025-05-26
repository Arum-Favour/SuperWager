"use client";

import { somniaChain } from "@/utils/privy/chain";
import { PrivyProvider as Privy } from "@privy-io/react-auth";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          accentColor: "#0080ff",
          theme: "#fff",
          showWalletLoginFirst: false,
          logo: "/Superwager.png",
        },
        loginMethods: ["email"],
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
        // Use the properly defined Somnia chain
        defaultChain: somniaChain,
        // Also add it to supported chains
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
