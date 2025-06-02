export const CONTRACTS = {
  "0xc488": {
    // Somnia network ID (50312 in decimal)
    POOL_CONTRACT: "0xCE25cf51550D16A2e8cE3FCa8A8B0b033dbE6993", // Replace with your actual contract address
  },
};

export const getContractAddress = (chainId: string | number) => {
  const chainIdHex =
    typeof chainId === "number" ? `0x${chainId.toString(16)}` : chainId;

  if (!CONTRACTS[chainIdHex as keyof typeof CONTRACTS]) {
    throw new Error(`No contracts configured for chain ID ${chainIdHex}`);
  }

  return CONTRACTS[chainIdHex as keyof typeof CONTRACTS].POOL_CONTRACT;
};
