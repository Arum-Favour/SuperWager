import { BetData, LeaderboardEntry, UserStats } from "@/types/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

export const addBet = async (betData: Omit<BetData, "id">, bet_id: string) => {
  try {
    const docRef = doc(db, "bets", bet_id);
    await setDoc(docRef, {
      ...betData,
      timestamp: Date.now(),
    });
    return bet_id;
  } catch (error) {
    console.error("Error adding bet:", error);
    throw error;
  }
};

export const currentBet = async (
  walletAddress: string
): Promise<BetData | null> => {
  try {
    const q = query(
      collection(db, "bets"),
      where("walletAddress", "==", walletAddress),
      where("status", "==", "pending"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`⚠️ No ongoing bets found for user: ${walletAddress}`);
      return null;
    }

    const latestBet = querySnapshot.docs[0];
    const betData = {
      id: latestBet.id,
      ...latestBet.data(),
    } as BetData;

    console.log(`✅ Retrieved current bet for user: ${walletAddress}`);
    return betData;
  } catch (error) {
    console.error("Error getting current bet:", error);
    return null;
  }
};

export const updateBetStatus = async (
  betId: string,
  data: GameState,
  walletAddress: string
) => {
  try {
    const betRef = doc(db, "bets", betId);
    await updateDoc(betRef, { ...data, settled: true });

    await updateUserStats(walletAddress, {
      odds: data.slips.reduce((acc, slip) => acc + parseFloat(slip.odds), 0),
      settled: true,
      status: data.slips.every((slip) => slip.outcome === "won")
        ? "won"
        : "lost",
    });
  } catch (error) {
    console.error("Error updating bet status:", error);
    throw error;
  }
};

export const getUserBets = async (
  walletAddress: string
): Promise<BetData[]> => {
  try {
    const q = query(
      collection(db, "bets"),
      where("walletAddress", "==", walletAddress),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as BetData)
    );
  } catch (error) {
    console.error("Error getting user bets:", error);
    return [];
  }
};

// User Stats Collection
export const initializeUserStats = async (walletAddress: string) => {
  try {
    const userStatsRef = doc(db, "userStats", walletAddress);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      const initialStats: Partial<UserStats> = {
        walletAddress,
        totalBets: 1,
        settledBets: 0,
        wonBets: 0,
        lostBets: 0,
        totalOddsWon: 0,
        totalOddsConcluded: 0,
        accuracy: 0,
        // oddsProduct: 1,
        poolParticipant: false,
        lastUpdated: Date.now(),
      };

      await setDoc(userStatsRef, initialStats);
      console.log(`✅ Initialized stats for user: ${walletAddress}`);
    }

    return;
  } catch (error) {
    console.error("Error initializing user stats:", error);
    throw error;
  }
};

export const getUserStats = async (
  walletAddress: string
): Promise<UserStats | null> => {
  try {
    const userStatsRef = doc(db, "userStats", walletAddress);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      console.log(`⚠️ No stats found for user: ${walletAddress}`);
      return null;
    }

    const userStats = userStatsDoc.data() as UserStats;
    console.log(`✅ Retrieved stats for user: ${walletAddress}`);
    return userStats;
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
};

export const updateUserStats = async (
  walletAddress: string,
  betData: { odds: number; settled: true; status: "won" | "lost" }
) => {
  try {
    const userStatsRef = doc(db, "userStats", walletAddress);
    const userStatsDoc = await getDoc(userStatsRef);

    let currentStats: Partial<UserStats> = {
      walletAddress,
      totalBets: 0,
      settledBets: 0,
      wonBets: 0,
      lostBets: 0,
      totalOddsWon: 0,
      totalOddsConcluded: 0,
      accuracy: 0,
      poolParticipant: false,
    };

    if (userStatsDoc.exists()) currentStats = userStatsDoc.data();

    currentStats.totalBets! += 1;

    if (betData.settled) {
      currentStats.settledBets! += 1;
      currentStats.totalOddsConcluded! += betData.odds;

      if (betData.status === "won") {
        currentStats.wonBets! += 1;
        currentStats.totalOddsWon! += betData.odds;
        currentStats.oddsProduct! *= betData.odds;
      } else currentStats.lostBets! += 1;

      currentStats.accuracy =
        currentStats.totalOddsConcluded! > 0
          ? currentStats.totalOddsWon! / currentStats.totalOddsConcluded!
          : 0;
    }

    currentStats.lastUpdated = Date.now();
    await updateDoc(userStatsRef, currentStats);
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};

// Leaderboard
export const getLeaderboard = async (
  limitCount: number = 50
): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, "userStats"),
      where("settledBets", ">", 0),
      orderBy("accuracy", "desc"),
      orderBy("oddsProduct", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const leaderboard = querySnapshot.docs.map(
      (doc, index) =>
        ({
          id: doc.id,
          rank: index + 1,
          score: doc.data().accuracy * Math.log(doc.data().oddsProduct || 1),
          ...doc.data(),
        } as LeaderboardEntry)
    );

    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return [];
  }
};

// Pool Management
export const updatePoolParticipation = async (
  walletAddress: string,
  isParticipant: boolean
) => {
  try {
    const userStatsRef = doc(db, "userStats", walletAddress);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) await initializeUserStats(walletAddress);

    // Update pool participation
    await updateDoc(userStatsRef, {
      poolParticipant: isParticipant,
      lastUpdated: Date.now(),
    });

    console.log(
      `✅ Updated pool participation for ${walletAddress}: ${isParticipant}`
    );
  } catch (error) {
    console.error("Error updating pool participation:", error);
    throw error;
  }
};

// Get pool participants
export const getPoolParticipants = async (): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, "userStats"),
      where("poolParticipant", "==", true),
      orderBy("accuracy", "desc"),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    const participants = querySnapshot.docs.map(
      (doc, index) =>
        ({
          id: doc.id,
          rank: index + 1,
          score: doc.data().accuracy * Math.log(doc.data().oddsProduct || 1),
          ...doc.data(),
        } as LeaderboardEntry)
    );

    console.log(
      `🎯 Fetched ${participants.length} pool participants from Firebase`
    );
    return participants;
  } catch (error) {
    console.error("Error getting pool participants:", error);
    return [];
  }
};
