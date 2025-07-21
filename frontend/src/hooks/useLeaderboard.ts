import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/lib/firebase/firestore';
import { LeaderboardEntry } from '@/types/firebase';

export const useLeaderboard = (limit: number = 50) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard(limit);
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Update every hour
    const interval = setInterval(fetchLeaderboard, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [limit]);

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
};