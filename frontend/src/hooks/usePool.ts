import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { usePrivy } from "@privy-io/react-auth";
import {
  getPoolStatus,
  enterPool,
  closePoolAndDistribute,
} from "@/lib/pool/integration";

export const usePool = () => {
  const { user, authenticated } = usePrivy();
  const [poolData, setPoolData] = useState({
    isActive: false,
    playerCount: "0",
    poolBalance: "0",
    winnersSelected: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoolData = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Ethers v5 syntax
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const data = await getPoolStatus(provider);
        setPoolData(data);
        setError(null);
      } else {
        // Fallback to mock data if no wallet connected
        setPoolData({
          isActive: true,
          playerCount: "5",
          poolBalance: "0.15",
          winnersSelected: false,
        });
        setError(null);
      }
    } catch (err) {
      setError("Failed to load pool data");
      console.error("Error loading pool data:", err);
      // Set mock data on error
      setPoolData({
        isActive: true,
        playerCount: "0",
        poolBalance: "0.0",
        winnersSelected: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnterPool = async () => {
    if (!authenticated || !user?.wallet?.address) {
      throw new Error("Please connect your wallet");
    }

    try {
      if (!window.ethereum) throw new Error("Ethereum provider not found");

      // Ethers v5 syntax
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const txHash = await enterPool(signer, user.wallet.address);

      // Refresh pool data
      await fetchPoolData();

      return txHash;
    } catch (error) {
      console.error("Error entering pool:", error);
      throw error;
    }
  };

  const handleClosePool = async () => {
    if (!authenticated || !user?.wallet?.address) {
      throw new Error("Please connect your wallet");
    }

    try {
      if (!window.ethereum) throw new Error("Ethereum provider not found");

      // Ethers v5 syntax
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const result = await closePoolAndDistribute(signer);

      // Refresh pool data
      await fetchPoolData();

      return result;
    } catch (error) {
      console.error("Error closing pool:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPoolData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchPoolData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    poolData,
    loading,
    error,
    enterPool: handleEnterPool,
    closePool: handleClosePool,
    refetch: fetchPoolData,
  };
};
