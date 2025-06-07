import PoolContractABI from "@/assets/data/PoolContract.json";
import { getContractAddress } from "@/utils/privy/addresses";
import { somniaChain } from "@/utils/privy/chain";
import { usePrivy, useSendTransaction, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export function usePoolContract() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [embeddedWallet, setEmbeddedWallet] = useState<any>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (!authenticated || !wallets || wallets.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const embedded = wallets.find(
          (wallet) => wallet.walletClientType === "privy"
        );

        if (!embedded) {
          setError("No embedded wallet found");
          setLoading(false);
          return;
        }

        setEmbeddedWallet(embedded);
        console.log(embedded);
        const ethProvider = await embedded.getEthereumProvider();
        const ethersProvider = new ethers.providers.Web3Provider(ethProvider);
        setProvider(ethersProvider);

        const contractAddress = getContractAddress(somniaChain.id);

        // Create contract instance - readonly
        const poolContract = new ethers.Contract(
          contractAddress,
          PoolContractABI.abi,
          ethersProvider
        );

        setContract(poolContract);
        setError(null);
      } catch (err) {
        console.error("Error initializing pool contract:", err);
        setError(
          "Failed to initialize contract. Please check your wallet connection."
        );
      } finally {
        setLoading(false);
      }
    };

    initContract();
  }, [authenticated, wallets]);

  // Get current pool balance
  const getPoolBalance = async (): Promise<string> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const balance = await contract.getPoolBalance();
      return ethers.utils.formatEther(balance);
    } catch (err) {
      console.error("Error getting pool balance:", err);
      throw new Error("Failed to get pool balance");
    }
  };

  // Enter the pool by sending STT
  const enterPool = async (amount?: string) => {
    if (!contract || !provider || !embeddedWallet) {
      throw new Error("Contract not initialized");
    }

    try {
      // Get MIN_DEPOSIT value
      let value;
      try {
        value = await contract.MIN_DEPOSIT();
        console.log(
          "Using MIN_DEPOSIT from contract:",
          ethers.utils.formatEther(value)
        );
      } catch (err) {
        value = ethers.utils.parseEther(amount || "0.01");
        console.log("Using fallback value:", ethers.utils.formatEther(value));
      }

      // Create transaction with proper format for Privy
      const tx = {
        to: contract.address,
        data: contract.interface.encodeFunctionData("enterPool", []),
        chainId: somniaChain.id,
        value: ethers.utils.hexlify(value),
      };

      // UI configuration based on Privy docs
      const options = {
        uiOptions: {
          header: "Enter Betting Pool",
          description: `Send ${ethers.utils.formatEther(
            value
          )} STT to enter the betting pool`,
          buttonText: "Enter Pool",
        },
      };

      console.log("Sending transaction:", tx);

      // Proper call format according to docs
      const { hash } = await sendTransaction(tx, options);
      console.log("Transaction sent with hash:", hash);

      // Optionally wait for confirmation
      const receipt = await provider.waitForTransaction(hash);
      console.log("Transaction confirmed:", receipt);

      return { hash, receipt };
    } catch (err) {
      console.error("Error entering pool:", err);
      throw err;
    }
  };

  // Check if user has entered the pool
  const hasUserEnteredPool = async (): Promise<boolean> => {
    if (!contract || !embeddedWallet) return false;

    try {
      return await contract.hasEntered(embeddedWallet.address);
    } catch (err) {
      console.error("Error checking pool entry status:", err);
      return false;
    }
  };

  // Check if the pool is active
  const isPoolActive = async (): Promise<boolean> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      return await contract.poolActive();
    } catch (err) {
      console.error("Error checking pool status:", err);
      return false;
    }
  };

  // Check if winners have been selected
  const areWinnersSelected = async (): Promise<boolean> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      return await contract.winnersSelected();
    } catch (err) {
      console.error("Error checking if winners selected:", err);
      return false;
    }
  };

  // Check if current user is a winner
  const isUserWinner = async (): Promise<boolean> => {
    if (!contract || !embeddedWallet) return false;

    try {
      const winnersSelected = await contract.winnersSelected();
      if (!winnersSelected) return false;

      const winnerCount = await contract.WINNER_COUNT();

      // Check if the user's address is in the winners array
      for (let i = 0; i < winnerCount; i++) {
        const winner = await contract.winners(i);
        if (winner.toLowerCase() === embeddedWallet.address.toLowerCase()) {
          return true;
        }
      }

      return false;
    } catch (err) {
      console.error("Error checking if user is winner:", err);
      return false;
    }
  };

  // Get player count
  const getPlayerCount = async (): Promise<number> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const count = await contract.getPlayerCount();
      return count.toNumber();
    } catch (err) {
      console.error("Error getting player count:", err);
      return 0;
    }
  };

  // Get wallet balance
  const getWalletBalance = async (): Promise<string> => {
    if (!provider || !embeddedWallet) throw new Error("Wallet not initialized");

    try {
      const balance = await provider.getBalance(embeddedWallet.address);
      return ethers.utils.formatEther(balance);
    } catch (err) {
      console.error("Error getting wallet balance:", err);
      throw new Error("Failed to get wallet balance");
    }
  };

  // Add this function to debug contract state
  const debugContractState = async (): Promise<any> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      // Gather all relevant contract state in one call
      const isActive = await contract.poolActive();
      const minDeposit = await contract.MIN_DEPOSIT();
      const totalBalance = await contract.getPoolBalance();
      const playerCount = await contract.getPlayerCount();
      const hasEnded = false; // Assuming no direct function for this
      const winnersSelected = await contract.winnersSelected();

      console.log("Contract State Debug:");
      console.log("- Pool Active:", isActive);
      console.log(
        "- Min Deposit:",
        ethers.utils.formatEther(minDeposit),
        "STT"
      );
      console.log(
        "- Pool Balance:",
        ethers.utils.formatEther(totalBalance),
        "STT"
      );
      console.log("- Player Count:", playerCount.toString());
      console.log("- Winners Selected:", winnersSelected);

      return {
        isActive,
        minDeposit: ethers.utils.formatEther(minDeposit),
        totalBalance: ethers.utils.formatEther(totalBalance),
        playerCount: playerCount.toString(),
        winnersSelected,
      };
    } catch (err) {
      console.error("Error debugging contract state:", err);
      return null;
    }
  };

  return {
    contract,
    loading,
    error,
    getPoolBalance,
    enterPool,
    hasUserEnteredPool,
    isPoolActive,
    areWinnersSelected,
    isUserWinner,
    getPlayerCount,
    getWalletBalance,
    debugContractState, // Add this new function
  };
}
