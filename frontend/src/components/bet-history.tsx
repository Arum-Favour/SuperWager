"use client";

import soccer from "@/assets/images/soccer.png";
import GreenCheckIcon from "@/assets/svgs/green-check";
import { PendingIconBlack, PendingIconBlue } from "@/assets/svgs/pending";
import RedXIcon from "@/assets/svgs/red-x";
import { useBettingSlips } from "@/context/useBettingSlips";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BetHistory() {
  const [history, setHistory] = useState<GameState[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("history") || "[]"));
  }, []);

  const {
    slips,
    hasEnteredPool,
    hasPoolEnded,
    hasPoolStarted,
    hasWon,
    poolId,
  } = useBettingSlips();

  const [tab, setTab] = useState<"all" | "ongoing" | "closed">("all");
  const [activeSlip, setActiveSlip] = useState<number | null>(null);

  const [allGames, setAllGames] = useState<GameState[]>([
    { slips, hasEnteredPool, hasPoolEnded, hasPoolStarted, hasWon, poolId },
    ...history,
  ]);

  useEffect(() => {
    if (tab === "all") {
      setAllGames([
        ...(slips.length
          ? [
              {
                slips,
                hasEnteredPool,
                hasPoolEnded,
                hasPoolStarted,
                hasWon,
                poolId,
              },
            ]
          : []),
        ...history,
      ]);
      return;
    }
    if (tab === "ongoing") {
      setAllGames([
        ...(slips.length
          ? [
              {
                slips,
                hasEnteredPool,
                hasPoolEnded,
                hasPoolStarted,
                hasWon,
                poolId,
              },
            ]
          : []),
      ]);
      return;
    }
    if (tab === "closed") {
      setAllGames(history);
      return;
    }
  }, [tab]);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h2 className="text-3xl flex gap-2">Bet History</h2>
        <div className="flex gap-6 w-full overflow-x-auto items-center">
          <h4
            onClick={() => setTab("all")}
            className={`${
              tab === "all" ? "text-black" : "text-[#404040]"
            } text-xl flex gap-2 items-center cursor-pointer`}
          >
            All
            <span className="py-0.5 px-2.5 rounded-md bg-[#F2F9FF] text-black/50">
              {history.length + slips.length}
            </span>
          </h4>
          <h4
            onClick={() => setTab("ongoing")}
            className={`${
              tab === "ongoing" ? "text-black" : "text-[#404040]"
            } text-xl flex gap-2 items-center cursor-pointer`}
          >
            Ongoing
            <span className="py-0.5 px-2.5 rounded-md bg-[#F2F9FF] text-black/50">
              {slips.length}
            </span>
          </h4>
          <h4
            onClick={() => setTab("closed")}
            className={`${
              tab === "closed" ? "text-black" : "text-[#404040]"
            } text-xl flex gap-2 items-center cursor-pointer`}
          >
            Closed
            <span className="py-0.5 px-2.5 rounded-md bg-[#F2F9FF] text-black/50">
              {history.length}
            </span>
          </h4>
        </div>
      </div>

      <div className="space-y-6">
        {!allGames.length && (
          <p className="text-center text-2xl font-medium">
            No betting slip available,{" "}
            <Link href={"/create-slip"} className="text-[var(--primary)]">
              Create Slip
            </Link>
          </p>
        )}
        {allGames.map((match, idx) => (
          <div
            key={match.poolId}
            onClick={() => setActiveSlip((prev) => (prev === idx ? null : idx))}
            className="space-y-4 bg-[#F2F9FF] rounded-3xl p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-6 text-lg">
              <div className="space-y-6">
                <h4>Betting Slip {poolId}</h4>
                <p>Pool: 0.1 STT</p>
              </div>
              <div className="flex flex-col gap-6 items-end">
                <p>Total Games: {match.slips.length}</p>
                <p>
                  Total Odds:{" "}
                  {match.slips
                    .reduce((acc, slip) => acc + parseFloat(slip.odds), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
            {activeSlip === idx && (
              <>
                <div className="h-[0.5px] w-full rounded-sm bg-[var(--primary)]" />

                <div className="pt-2 flex flex-col gap-6">
                  {match.slips.map((game, i) => (
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
                        <div className="flex items-center gap-6">
                          <Image src={soccer} alt="image of a soccerball" />

                          <p className="flex flex-col items-center justify-center w-20"></p>
                        </div>
                        <div className="flex gap-16">
                          {game.outcome === "won" && <GreenCheckIcon />}
                          {game.outcome === "lost" && <RedXIcon />}

                          {game.outcome === "pending" &&
                            new Date(game.matchDate) > new Date() && (
                              <PendingIconBlack />
                            )}
                          {game.outcome === "pending" &&
                            !(new Date(game.matchDate) > new Date()) && (
                              <PendingIconBlue />
                            )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-8">
                          <div className="flex gap-16 justify-between w-64">
                            <p>{game.homeTeam}</p>
                            <p>{game.finalHomeScore ?? "-"}</p>
                          </div>
                          <div className="flex gap-16 justify-between w-64">
                            <p>{game.awayTeam}</p>
                            <p>{game.finalAwayScore ?? "-"}</p>
                          </div>
                        </div>
                        <div className="flex gap-16 mt-auto capitalize">
                          <p className="text-xl self-start">{game.selection}</p>
                          <p className="text-xl">
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
        ))}
      </div>
    </div>
  );
}
