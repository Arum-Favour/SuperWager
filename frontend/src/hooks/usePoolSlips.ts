"use client";

import { useEffect, useState } from 'react';
import { getPoolBettingSlips } from '@/lib/firebase/firestore';
import { StoredBettingSlip } from '@/types/firebase';

export const usePoolSlips = (poolId: string) => {
  const [slips, setSlips] = useState<StoredBettingSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poolId) return;

    const fetchPoolSlips = async () => {
      try {
        setLoading(true);
        const data = await getPoolBettingSlips(poolId);
        setSlips(data as StoredBettingSlip[]);
        setError(null);
        console.log(`📊 Fetched ${data.length} slips for pool ${poolId}`);
      } catch (err) {
        console.error('Error fetching pool slips:', err);
        setError('Failed to load pool slips');
      } finally {
        setLoading(false);
      }
    };

    fetchPoolSlips();
  }, [poolId]);

  return { slips, loading, error };
};