import { ethers } from "ethers";
import poolContractABI from "@/assets/data/PoolContract.json";
import {
  updatePoolParticipation,
  getPoolParticipants,
} from "@/lib/firebase/firestore";

const POOL_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_POOL_CONTRACT_ADDRESS ||
  "0x1234567890123456789012345678901234567890";

type EthersProvider =
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider;

export const getPoolStatus = async (provider: EthersProvider) => {
  try {
    if (!process.env.NEXT_PUBLIC_POOL_CONTRACT_ADDRESS) {
      return {
        isActive: true,
        playerCount: "8",
        poolBalance: "0.25",
        winnersSelected: false,
      };
    }

    const poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS,
      poolContractABI.abi,
      provider
    );

    let playerCount, poolBalance;

    try {
      [playerCount, poolBalance] = await Promise.all([
        poolContract.getPlayerCount
          ? poolContract.getPlayerCount()
          : Promise.resolve(ethers.BigNumber.from(0)),
        poolContract.getPoolBalance
          ? poolContract.getPoolBalance()
          : Promise.resolve(ethers.BigNumber.from(0)),
      ]);
    } catch (contractError) {
      console.warn("Contract methods not available, using mock data");
      return {
        isActive: true,
        playerCount: "5",
        poolBalance: "0.1",
        winnersSelected: false,
      };
    }

    // Handle ethers v5 BigNumber formats
    const playerCountStr = playerCount?.toString ? playerCount.toString() : "0";
    let poolBalanceStr = "0.0";

    try {
      // Use ethers v5 format
      poolBalanceStr = ethers.utils.formatEther(poolBalance || 0);
    } catch (e) {
      console.warn("Error formatting pool balance:", e);
      poolBalanceStr = "0.0";
    }

    return {
      isActive: true, // Add poolActive() call if available in your contract
      playerCount: playerCountStr,
      poolBalance: poolBalanceStr,
      winnersSelected: false, // Add winnersSelected() call if available
    };
  } catch (error) {
    console.error("Error getting pool status:", error);
    // Return mock data on error
    return {
      isActive: true,
      playerCount: "0",
      poolBalance: "0.0",
      winnersSelected: false,
    };
  }
};

export const enterPool = async (
  signer: ethers.Signer,
  walletAddress: string
) => {
  try {
    if (!process.env.NEXT_PUBLIC_POOL_CONTRACT_ADDRESS) {
      // Mock transaction for development
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await updatePoolParticipation(walletAddress, true);
      return "0x1234567890123456789012345678901234567890123456789012345678901234567890";
    }

    const poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS,
      poolContractABI.abi,
      signer
    );

    // Check if user already entered (if method exists)
    try {
      const hasEntered = await poolContract.hasEntered(walletAddress);
      if (hasEntered) {
        throw new Error("Already entered the pool");
      }
    } catch (e) {
      // Method might not exist, continue
      console.warn("hasEntered method not available");
    }

    // Get minimum deposit (if method exists)
    let minDeposit;
    try {
      minDeposit = await poolContract.MIN_DEPOSIT();
    } catch (e) {
      // Use default value if method doesn't exist - ethers v5 format
      minDeposit = ethers.utils.parseEther("0.01");
    }

    // Enter pool on blockchain
    const tx = await poolContract.enterPool({ value: minDeposit });
    await tx.wait();

    // Update Firebase
    await updatePoolParticipation(walletAddress, true);

    return tx.hash;
  } catch (error) {
    console.error("Error entering pool:", error);
    throw error;
  }
};

export const closePoolAndDistribute = async (signer: ethers.Signer) => {
  try {
    if (!process.env.NEXT_PUBLIC_POOL_CONTRACT_ADDRESS) {
      // Mock transaction for development
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const participants = await getPoolParticipants();
      return {
        closeTx:
          "0x1111111111111111111111111111111111111111111111111111111111111111",
        selectTx:
          "0x2222222222222222222222222222222222222222222222222222222222222222",
        distributeTx:
          "0x3333333333333333333333333333333333333333333333333333333333333333",
        winners: participants
          .slice(0, Math.ceil(participants.length * 0.1))
          .map((p) => p.walletAddress),
      };
    }

    const poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS,
      poolContractABI.abi,
      signer
    );

    // Get winners from Firebase (top 10%)
    const participants = await getPoolParticipants();
    const winnersCount = Math.ceil(participants.length * 0.1);
    const winners = participants.slice(0, winnersCount);

    // Close pool on blockchain
    const closeTx = await poolContract.closePool();
    await closeTx.wait();

    // Select winners (requires owner privileges)
    const selectTx = await poolContract.selectWinners();
    await selectTx.wait();

    // Distribute prizes
    const distributeTx = await poolContract.distributePrizes();
    await distributeTx.wait();

    return {
      closeTx: closeTx.hash,
      selectTx: selectTx.hash,
      distributeTx: distributeTx.hash,
      winners: winners.map((w) => w.walletAddress),
    };
  } catch (error) {
    console.error("Error closing pool:", error);
    throw error;
  }
};
