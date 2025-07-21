// "use client";

// import { somniaChain } from "@/utils/privy/chain";
// import { PrivyProvider as Privy } from "@privy-io/react-auth";

// export function PrivyProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <Privy
//       appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
//       config={{
//         appearance: {
//           accentColor: "#0080ff",
//           theme: "#fff",
//           showWalletLoginFirst: false,
//           logo: "/Superwager.png",
//         },
//         loginMethods: ["email"],
//         fundingMethodConfig: {
//           moonpay: {
//             useSandbox: true,
//           },
//         },
//         embeddedWallets: {
//           createOnLogin: "users-without-wallets",
//           requireUserPasswordOnCreate: false,
//           showWalletUIs: true,
//         },
//         // Use the properly defined Somnia chain
//         defaultChain: somniaChain,
//         // Also add it to supported chains
//         supportedChains: [somniaChain],
//         mfa: {
//           noPromptOnMfaRequired: false,
//         },
//       }}
//     >
//       {children}
//     </Privy>
//   );
// }


// "use client";

// import { somniaChain } from "@/utils/privy/chain";
// import { PrivyProvider as Privy } from "@privy-io/react-auth";

// export function PrivyProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <Privy
//       appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
//       config={{
//         appearance: {
//           accentColor: "#0080ff",
//           theme: "#fff",
//           showWalletLoginFirst: true, // Show wallet options first
//           logo: "/Superwager.png",
//           // walletChainType: "ethereum-and-solana", // Support both Ethereum and Solana wallets
//         },
//         // Enable multiple login methods including external wallets
//         loginMethods: [
//           "wallet", // Enable external wallet connections (MetaMask, etc.)
//           "email",
//           // "sms",
//           // "google",
//           // "twitter",
//           // "discord",
//           // "github"
//         ],
//         fundingMethodConfig: {
//           moonpay: {
//             useSandbox: true,
//           },
//         },
//         embeddedWallets: {
//           createOnLogin: "users-without-wallets", // Only create embedded wallet if user doesn't have one
//           requireUserPasswordOnCreate: false,
//           showWalletUIs: true,
//         },
//         // Wallet configuration for external wallets
//         externalWallets: {
//           coinbaseWallet: {
//             // Coinbase Wallet connection options
//             connectionOptions: "eoaOnly", // or "smartWalletOnly" or "all"
//           },
//           // metamask: {
//           //   // MetaMask specific options (optional)
//           // },
//           // walletConnect: {
//           //   // WalletConnect for mobile wallets
//           //   enabled: true,
//           // },
//           // phantom: {
//           //   // Phantom wallet for Solana (if supporting Solana)
//           // },
//           // zerion: {
//           //   // Zerion wallet options
//           // },
//         },
//         // Use the properly defined Somnia chain
//         defaultChain: somniaChain,
//         // Also add it to supported chains
//         supportedChains: [somniaChain],
//         mfa: {
//           noPromptOnMfaRequired: false,
//         },
//         // Additional wallet options
//         // additionalChains: [], // Add other chains if needed
//       }}
//     >
//       {children}
//     </Privy>
//   );
// }


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
          coinbaseWallet: {
            connectionOptions: "eoaOnly",
          },
          // Temporarily disable WalletConnect to avoid the proposal error
          // walletConnect: {
          //   enabled: false, // Explicitly disable
          // },
        },
        defaultChain: somniaChain,
        supportedChains: [somniaChain],
        mfa: {
          noPromptOnMfaRequired: false,
        },
        // Disable WalletConnect entirely in the config
        // _experimental: {
        //   // This helps Privy prioritize browser extensions over WalletConnect
        // },
      }}
    >
      {children}
    </Privy>
  );
}