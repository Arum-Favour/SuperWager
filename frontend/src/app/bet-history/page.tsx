// "use client";

// import BetHistory from "@/components/bet-history";

// export default function page() {
//   return <BetHistory />;
// }




"use client";

import { getUserBets } from "@/lib/firebase/firestore";
import { BetData } from "@/types/firebase";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useAuthModal } from "@/context/AuthModalContext";

export default function BetHistory() {
  const { authenticated, user } = usePrivy();
  const { handleLogin } = useAuthModal();
  const [bets, setBets] = useState<BetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBets = async () => {
      if (authenticated && user?.wallet?.address) {
        try {
          const userBets = await getUserBets(user.wallet.address);
          setBets(userBets);
        } catch (error) {
          console.error('Error loading bets:', error);
        }
      }
      setLoading(false);
    };

    loadBets();
  }, [authenticated, user]);

  if (!authenticated) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="text-gray-600 mb-6">Please sign in to view your bet history</p>
        <button
          onClick={handleLogin}
          className="bg-[var(--primary)] text-white px-6 py-2 rounded-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-20">Loading your bet history...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bet History</h1>
      
      {bets.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">No bets found</p>
          <a href="/create-slip" className="text-[var(--primary)] hover:underline">
            Place your first bet
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bets.map((bet) => (
            <div key={bet.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{bet.selection}</p>
                    <p className="text-sm text-gray-600">
                      Odds: {bet.odds} | Stake: {bet.stake} STT
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-medium">
                      {bet.potentialWin.toFixed(4)} STT
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(bet.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className={`px-2 py-1 rounded text-xs ${
                    bet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    bet.status === 'won' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {bet.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}