import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { db } from './config';
import { BetData, UserStats, LeaderboardEntry, PoolData } from '@/types/firebase';

// Bets Collection
export const addBet = async (betData: Omit<BetData, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'bets'), {
      ...betData,
      timestamp: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding bet:', error);
    throw error;
  }
};

export const updateBetStatus = async (betId: string, status: 'won' | 'lost') => {
  try {
    const betRef = doc(db, 'bets', betId);
    await updateDoc(betRef, {
      status,
      settled: true,
      settledAt: Date.now()
    });
  } catch (error) {
    console.error('Error updating bet status:', error);
    throw error;
  }
};

export const getUserBets = async (walletAddress: string): Promise<BetData[]> => {
  try {
    const q = query(
      collection(db, 'bets'),
      where('walletAddress', '==', walletAddress),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BetData));
  } catch (error) {
    console.error('Error getting user bets:', error);
    return [];
  }
};

// User Stats Collection
export const updateUserStats = async (walletAddress: string, betData: BetData) => {
  try {
    const userStatsRef = doc(db, 'userStats', walletAddress);
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
      oddsProduct: 1,
      poolParticipant: false
    };

    if (userStatsDoc.exists()) {
      currentStats = { ...currentStats, ...userStatsDoc.data() };
    }

    currentStats.totalBets! += 1;
    
    if (betData.settled) {
      currentStats.settledBets! += 1;
      currentStats.totalOddsConcluded! += betData.odds;
      
      if (betData.status === 'won') {
        currentStats.wonBets! += 1;
        currentStats.totalOddsWon! += betData.odds;
        currentStats.oddsProduct! *= betData.odds;
      } else {
        currentStats.lostBets! += 1;
      }
      
      currentStats.accuracy = currentStats.totalOddsConcluded! > 0 
        ? currentStats.totalOddsWon! / currentStats.totalOddsConcluded! 
        : 0;
    }

    currentStats.lastUpdated = Date.now();
    await updateDoc(userStatsRef, currentStats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

// Leaderboard
export const getLeaderboard = async (limitCount: number = 50): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, 'userStats'),
      where('settledBets', '>', 0),
      orderBy('accuracy', 'desc'),
      orderBy('oddsProduct', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard = querySnapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      score: doc.data().accuracy * Math.log(doc.data().oddsProduct || 1),
      ...doc.data()
    } as LeaderboardEntry));
    
    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

export const initializeUserStats = async (walletAddress: string) => {
  try {
    const userStatsRef = doc(db, 'userStats', walletAddress);
    const userStatsDoc = await getDoc(userStatsRef);
    
    if (!userStatsDoc.exists()) {
      const initialStats: Partial<UserStats> = {
        walletAddress,
        totalBets: 0,
        settledBets: 0,
        wonBets: 0,
        lostBets: 0,
        totalOddsWon: 0,
        totalOddsConcluded: 0,
        accuracy: 0,
        oddsProduct: 1,
        poolParticipant: false,
        lastUpdated: Date.now()
      };
      
      await setDoc(userStatsRef, initialStats);
      console.log(`✅ Initialized stats for user: ${walletAddress}`);
      return initialStats;
    } else {
      console.log(`📊 User stats already exist for: ${walletAddress}`);
      return userStatsDoc.data();

    }
  } catch (error) {
    console.error('Error initializing user stats:', error);
    throw error;
  }
};
// Pool Management
export const updatePoolParticipation = async (walletAddress: string, isParticipant: boolean) => {
  try {
    const userStatsRef = doc(db, 'userStats', walletAddress);
    const userStatsDoc = await getDoc(userStatsRef);
    
    if (!userStatsDoc.exists()) {
      // Initialize user stats if they don't exist
      await initializeUserStats(walletAddress);
    }
    
    // Update pool participation
    await updateDoc(userStatsRef, {
      poolParticipant: isParticipant,
      lastUpdated: Date.now()
    });
    
    console.log(`✅ Updated pool participation for ${walletAddress}: ${isParticipant}`);
  } catch (error) {
    console.error('Error updating pool participation:', error);
    throw error;
  }
};

// Get pool participants
export const getPoolParticipants = async (): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, 'userStats'),
      where('poolParticipant', '==', true),
      orderBy('accuracy', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const participants = querySnapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      score: doc.data().accuracy * Math.log(doc.data().oddsProduct || 1),
      ...doc.data()
    } as LeaderboardEntry));
    
    console.log(`🎯 Fetched ${participants.length} pool participants from Firebase`);
    return participants;
    
  } catch (error) {
    console.error('Error getting pool participants:', error);
    return [];
  }
};
// export const getPoolParticipants = async (): Promise<LeaderboardEntry[]> => {
//   try {
//     // Return mock participants for development
//     const mockParticipants = [
//       {
//         id: "1",
//         walletAddress: "0x1234567890123456789012345678901234567890",
//         totalBets: 25,
//         settledBets: 20,
//         wonBets: 15,
//         lostBets: 5,
//         totalOddsWon: 32.5,
//         totalOddsConcluded: 45.0,
//         accuracy: 0.72,
//         oddsProduct: 156.8,
//         lastUpdated: Date.now(),
//         poolParticipant: true,
//         rank: 1,
//         score: 3.6
//       }
//     ];
    
//     return mockParticipants;


    // When Firebase is configured, uncomment:
    // const q = query(
    //   collection(db, 'userStats'),
    //   where('poolParticipant', '==', true),
    //   where('settledBets', '>', 0)
    // );
    
    // const querySnapshot = await getDocs(q);
    // let participants = querySnapshot.docs.map(doc => ({
    //   id: doc.id,
    //   ...doc.data()
    // } as UserStats));
    
    // return participants
    //   .map(participant => ({
    //     ...participant,
    //     score: participant.accuracy * Math.log(participant.oddsProduct || 1)
    //   }))
    //   .sort((a, b) => b.score - a.score)
    //   .map((participant, index) => ({
    //     ...participant,
    //     rank: index + 1
    //   })) as LeaderboardEntry[];
//   } catch (error) {
//     console.error('Error getting pool participants:', error);
//     return [];
//   }
// };
