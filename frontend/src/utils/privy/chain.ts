import { defineChain } from "viem";

export const somniaChain = defineChain({
  id: 50312,
  name: "Somnia",
  network: "somnia",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Test Token",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network"],
      //   webSocket: ['wss://ws.somnia.network']
    },
    public: {
      http: ["https://dream-rpc.somnia.network"],
      //   webSocket: ['wss://ws.somnia.network']
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://shannon-explorer.somnia.network/",
    },
  },
  contracts: {},
});
