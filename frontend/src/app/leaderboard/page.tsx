"use client";

import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function LeaderboardTable() {
  const { leaderboard, loading, error } = useLeaderboard();

  if (loading)
    return <div className="text-center py-8">Loading leaderboard...</div>;

  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <p className="text-sm text-gray-600">
          Top performers based on accuracy and odds won
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Accuracy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Odds Won
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Bets
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboard.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  #{entry.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.walletAddress.slice(0, 6)}...
                  {entry.walletAddress.slice(-4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {(entry.accuracy * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.totalOddsWon.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.totalBets}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
