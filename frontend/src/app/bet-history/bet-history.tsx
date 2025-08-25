"use client";

import soccer from "@/assets/images/soccer.webp";
import GreenCheckIcon from "@/assets/svgs/green-check";
import { PendingIconBlack, PendingIconBlue } from "@/assets/svgs/pending";
import RedXIcon from "@/assets/svgs/red-x";
import { useAuthModal } from "@/context/AuthModalContext";
import { getUserBets } from "@/lib/firebase/firestore";
import { BetData } from "@/types/firebase";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BetHistory() {
  const { authenticated, user } = usePrivy();
  const {
    handleLogin,
    userData: { walletAddress },
  } = useAuthModal();
  const [bets, setBets] = useState<BetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlip, setActiveSlip] = useState<number | null>(null);

  useEffect(() => {
    const loadBets = async () => {
      if (authenticated && user?.wallet?.address) {
        try {
          const userBets = await getUserBets(
            walletAddress || user.wallet.address
          );
          setBets(userBets);
        } catch (error) {
          console.error("Error loading bets:", error);
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
        <p className="text-gray-600 mb-6">
          Please sign in to view your bet history
        </p>
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
          <a
            href="/create-slip"
            className="text-[var(--primary)] hover:underline"
          >
            Place your first bet
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bets.map((bet, idx) => (
            <div
              key={bet.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Odds: {bet.odds} | Stake: {bet.stake} STT
                </p>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-medium">
                      {/* {bet.potentialWin.toFixed(4)} STT */}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(bet.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className={`px-2 py-1 rounded text-xs ${
                      bet.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : bet.status === "won"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {bet.status}
                  </div>
                </div>
              </div>

              <div
                key={bet.poolId}
                onClick={() =>
                  setActiveSlip((prev) => (prev === idx ? null : idx))
                }
                className={`space-y-4 bg-[#F2F9FF] rounded-xl md:rounded-3xl p-3 md:p-6 cursor-pointer duration-0`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4 text-xs min-[420px]:text-sm sm:text-base md:text-lg">
                  <h4 className="col-span-2 sm:col-span-1">
                    Betting Slip{" "}
                    <span className="text-black/50">{bet.poolId}</span>
                  </h4>

                  <p className=" sm:ml-auto col-span-1">
                    Total Games:{" "}
                    <span className="text-black/50">{bet.slips.length}</span>
                  </p>
                  <p className="col-span-1">
                    Total Odds:{" "}
                    <span className="text-black/50">
                      {bet.slips
                        .reduce((acc, slip) => acc + parseFloat(slip.odds), 0)
                        .toFixed(2)}
                    </span>
                  </p>

                  <p className="col-span-2 sm:col-span-1 sm:ml-auto">
                    Pool: <span>0.1 STT</span>
                  </p>
                </div>
                {activeSlip === idx && (
                  <>
                    <div className="h-[0.5px] w-full rounded-sm bg-[var(--primary)]" />

                    <div className="pt-2 flex flex-col gap-4 sm:gap-6">
                      {bet.slips.map((game, i) => (
                        <div
                          key={i}
                          className={`${
                            game.outcome === "won"
                              ? "bg-[#32FF401A]"
                              : game.outcome === "lost"
                              ? "bg-[#F9070B1A]"
                              : "bg-white/50"
                          } p-6 flex flex-col justify-between gap-8 rounded-4xl`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 md:gap-6">
                              <Image
                                src={soccer}
                                alt="image of a soccerball"
                                className="size-6 sm:size-8 md:size-12"
                              />
                              <p className="flex flex-col items-center justify-center text-xs sm:text-sm md:text-base">
                                <>
                                  <span>
                                    {new Date(
                                      game.matchDate
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "2-digit",
                                    })}
                                  </span>
                                  <span>
                                    {`${new Date(game.matchDate)
                                      .getHours()
                                      .toString()
                                      .padStart(2, "0")}:${new Date(
                                      game.matchDate
                                    )
                                      .getMinutes()
                                      .toString()
                                      .padStart(2, "0")}`}
                                  </span>
                                </>
                              </p>
                            </div>
                            <div className="flex gap-8 md:gap-16">
                              {game.outcome === "won" && (
                                <GreenCheckIcon className="size-4 sm:size-6 md:size-7" />
                              )}
                              {game.outcome === "lost" && (
                                <RedXIcon className="size-4 sm:size-6 md:size-7" />
                              )}

                              {game.outcome === "pending" &&
                                new Date(game.matchDate) > new Date() && (
                                  <PendingIconBlack className="size-4 md:size-6" />
                                )}
                              {game.outcome === "pending" &&
                                !(new Date(game.matchDate) > new Date()) && (
                                  <PendingIconBlue className="size-4 md:size-6" />
                                )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-4 md:gap-8 text-xs sm:text-sm md:text-base">
                              <div className="flex gap-4 sm:gap-8 md:gap-16 justify-between md:w-64">
                                <p>{game.homeTeam}</p>
                                <p className="font-medium">
                                  {game.finalHomeScore ?? "-"}
                                </p>
                              </div>
                              <div className="flex gap-4 sm:gap-8 md:gap-16 justify-between md:w-64">
                                <p>{game.awayTeam}</p>
                                <p className="font-medium">
                                  {game.finalAwayScore ?? "-"}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-4 sm:gap-8 md:gap-16 mt-auto capitalize text-xs sm:text-sm md:text-xl">
                              <p>{game.selection}</p>
                              <p className="font-medium">
                                {parseFloat(game.odds).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
