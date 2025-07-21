"use client";

import { useEffect, useState } from 'react';
import { getPoolParticipants } from '@/lib/firebase/firestore';
import { UserStats } from '@/types/firebase';

// Define LeaderboardEntry locally if not exported from types
interface LeaderboardEntry extends UserStats {
  rank: number;
  score: number;
}

// import { useEffect, useState } from 'react';
// // Update the import path to match your actual file structure
// // Update the import path below if the location is different
// // import { getPoolParticipants, LeaderboardEntry } from '../../lib/firebase/firestore';
// // If the above path is incorrect, update it to the correct relative path, e.g.:
// import { getPoolParticipants, LeaderboardEntry } from '../lib/firebase/firestore';
// // or
// import { getPoolParticipants, LeaderboardEntry } from '@/lib/firebase/firestore';

export const usePoolParticipants = () => {
  const [participants, setParticipants] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const data = await getPoolParticipants();
        setParticipants(data);
        setError(null);
        console.log(`🎯 Fetched ${data.length} pool participants`);
      } catch (err) {
        console.error('Error fetching pool participants:', err);
        setError('Failed to load pool participants');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchParticipants, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { participants, loading, error };
};