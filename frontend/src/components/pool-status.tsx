"use client";

import { usePool } from "@/hooks/usePool";
import { useState } from "react";

export default function PoolStatus() {
  const { poolData, loading, error, enterPool, closePool } = usePool();
  const [actionLoading, setActionLoading] = useState(false);

  const handleEnterPool = async () => {
    try {
      setActionLoading(true);
      const txHash = await enterPool();
      alert(`Successfully entered pool! Transaction: ${txHash}`);
    } catch (error) {
      console.error('Error entering pool:', error);
      alert('Failed to enter pool');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClosePool = async () => {
    try {
      setActionLoading(true);
      const result = await closePool();
      alert(`Pool closed successfully! Winners selected and prizes distributed.`);
    } catch (error) {
      console.error('Error closing pool:', error);
      alert('Failed to close pool');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pool status...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Pool Status</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="font-medium">
            {poolData.isActive ? 'Active' : 'Closed'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Players</p>
          <p className="font-medium">{poolData.playerCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Pool Balance</p>
          <p className="font-medium">{poolData.poolBalance} ETH</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Winners Selected</p>
          <p className="font-medium">
            {poolData.winnersSelected ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {poolData.isActive && (
          <button
            onClick={handleEnterPool}
            disabled={actionLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading ? 'Entering...' : 'Enter Pool'}
          </button>
        )}
        
        <button
          onClick={handleClosePool}
          disabled={actionLoading || !poolData.isActive}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {actionLoading ? 'Closing...' : 'Close Pool'}
        </button>
      </div>
    </div>
  );
}