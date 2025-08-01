// export interface BetData {
//   id: string;
//   userId: string;
//   walletAddress: string;
//   matchId: string;
//   selection: string;
//   odds: number;
//   stake: number;
//   potentialWin: number;
//   timestamp: number;
//   status: 'pending' | 'won' | 'lost';
//   settled: boolean;
//   settledAt?: number;
// }

// export interface UserStats {
//   id: string;
//   walletAddress: string;
//   username?: string;
//   totalBets: number;
//   settledBets: number;
//   wonBets: number;
//   lostBets: number;
//   totalOddsWon: number;
//   totalOddsConcluded: number;
//   accuracy: number; // (totalOddsWon / totalOddsConcluded)
//   oddsProduct: number; // product of odds won
//   lastUpdated: number;
//   poolParticipant: boolean;
// }

// export interface LeaderboardEntry extends UserStats {
//   rank: number;
//   score: number; // combined score for ranking
// }

// export interface PoolData {
//   id: string;
//   isActive: boolean;
//   participants: string[];
//   totalPrizePool: number;
//   winners?: string[];
//   startTime: number;
//   endTime?: number;
//   lastUpdated: number;
// }

export interface BetData extends GameState {
  id: string;
  userId: string;
  walletAddress: string;
  odds: number;
  stake: number;
  timestamp: number;
  status: "pending" | "won" | "lost";
  settled: boolean;
  selection: string;
  potentialWin: number;
  settledAt?: number;
}

export interface UserStats {
  id: string;
  walletAddress: string;
  username?: string;
  totalBets: number;
  settledBets: number;
  wonBets: number;
  lostBets: number;
  totalOddsWon: number;
  totalOddsConcluded: number;
  accuracy: number;
  oddsProduct: number;
  lastUpdated: number;
  poolParticipant: boolean;
}

export interface LeaderboardEntry extends UserStats {
  rank: number;
  score: number;
}

export interface PoolData {
  id: string;
  isActive: boolean;
  participants: string[];
  totalPrizePool: number;
  winners?: string[];
  startTime: number;
  endTime?: number;
  lastUpdated: number;
}
