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
          showWalletLoginFirst: true,
          logo: "/Superwager.png",
          walletList: ["detected_wallets", "metamask", "coinbase_wallet"],
        },
        loginMethods: ["wallet", "email"],
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
        externalWallets: {
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
