import { defineChain } from 'viem';

export const somniaChain = defineChain({
  id: 0xc488, // Replace with the actual Somnia chain ID (use number, not string)
  name: 'Somnia',
  network: 'somnia',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia Test Token',
    symbol: 'STT'
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'], // Replace with actual RPC URL
    //   webSocket: ['wss://ws.somnia.network'] // Replace if WebSocket is available
    },
    public: {
      http: ['https://dream-rpc.somnia.network'], // Replace with actual RPC URL
    //   webSocket: ['wss://ws.somnia.network'] // Replace if WebSocket is available
    }
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://shannon-explorer.somnia.network/' // Replace with actual explorer URL
    }
  },
  contracts: {
    // Add any network-specific contract addresses if needed
  }
});