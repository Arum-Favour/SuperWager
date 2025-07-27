"use client";

import { useEffect } from 'react';
import { updateBettingSlipOutcome, updateUserStatsFromSlip } from '@/lib/firebase/firestore';
import { useAuthModal } from '@/context/AuthModalContext';
import { useBettingSlips } from '@/context/useBettingSlips';

export const useBettingSlipSync = (scoresData: Schedule[]) => {
  const { userData: { walletAddress } } = useAuthModal();
  const { slips, poolId, hasEnteredPool } = useBettingSlips();

  useEffect(() => {
    if (!hasEnteredPool || !walletAddress || !scoresData.length || !poolId) return;

    const syncOutcomes = async () => {
      for (let i = 0; i < slips.length; i++) {
        const slip = slips[i];
        const match = scoresData[i];

        if (!match || match.sport_event_status.match_status !== "ended") continue;

        const homeScore = match.sport_event_status.home_score as number;
        const awayScore = match.sport_event_status.away_score as number;

        const selection = slip.selection.toLowerCase();
        const isHomeWin = homeScore > awayScore;
        const isAwayWin = homeScore < awayScore;
        const isDraw = homeScore === awayScore;

        let outcome: 'won' | 'lost' = 'lost';
        
        if (
          (selection === "home" && isHomeWin) ||
          (selection === "away" && isAwayWin) ||
          (selection === "draw" && isDraw)
        ) {
          outcome = 'won';
        }

        // Only update if outcome has changed
        if (slip.outcome !== outcome) {
          try {
            await updateBettingSlipOutcome(
              walletAddress,
              poolId,
              i,
              outcome,
              homeScore,
              awayScore
            );
            
            console.log(`🔄 Synced outcome for match ${i}: ${outcome}`);
          } catch (error) {
            console.error(`❌ Failed to sync outcome for match ${i}:`, error);
          }
        }
      }

      // Check if all matches are settled and update user stats
      const allSettled = slips.every((_, i) => {
        const match = scoresData[i];
        return match && match.sport_event_status.match_status === "ended";
      });

      if (allSettled) {
        try {
          await updateUserStatsFromSlip(walletAddress, poolId);
          console.log(`📊 Updated user stats for completed slip`);
        } catch (error) {
          console.error(`❌ Failed to update user stats:`, error);
        }
      }
    };

    syncOutcomes();
  }, [scoresData, slips, walletAddress, poolId, hasEnteredPool]);
};