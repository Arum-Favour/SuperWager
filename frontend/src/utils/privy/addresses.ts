export const CONTRACTS = {
  "0xc488": {
    POOL_CONTRACT: process.env.NEXT_PUBLIC_POOL_CONTARCT_ADDRESS,
  },
};

export const getContractAddress = (chainId: string | number) => {
  const chainIdHex =
    typeof chainId === "number" ? `0x${chainId.toString(16)}` : chainId;

  if (!CONTRACTS[chainIdHex as keyof typeof CONTRACTS])
    throw new Error(`No contracts configured for chain ID ${chainIdHex}`);

  return CONTRACTS[chainIdHex as keyof typeof CONTRACTS].POOL_CONTRACT;
};
