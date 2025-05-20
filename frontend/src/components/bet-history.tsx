"use client";

import soccer from "@/assets/images/soccer.png";
import GreenCheckIcon from "@/assets/svgs/green-check";
import { PendingIconBlack, PendingIconBlue } from "@/assets/svgs/pending";
import RedXIcon from "@/assets/svgs/red-x";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BetHistory() {
  const [activeSlip, setActiveSlip] = useState<number | null>(null);
  const [history, setHistory] = useState<GameState[]>([]);

  useEffect(() => {
    if (typeof window === undefined) return;
    setHistory(JSON.parse(localStorage.getItem("history") || "[]"));
  }, [window]);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h2 className="text-3xl flex gap-2">Bet History</h2>
      </div>

      <div className="space-y-6">
        {!history.length && (
          <p className="text-center text-2xl font-medium">
            No betting slip available,{" "}
            <Link href={"/create-slip"} className="text-[var(--primary)]">
              Create Slip
            </Link>
          </p>
        )}
        {history.map((match, idx) => (
          <div
            key={match.poolId}
            onClick={() => setActiveSlip((prev) => (prev === idx ? null : idx))}
            className={`space-y-4 ${
              activeSlip === idx
                ? "bg-[#F2F9FF]"
                : match.hasWon === "won"
                ? "bg-[#32FF401A]"
                : "bg-[#F9070B1A]"
            } rounded-3xl p-6 cursor-pointer duration-0`}
          >
            <div className="flex items-center justify-between gap-6 text-lg">
              <div className="space-y-6">
                <h4>Betting Slip {match.poolId}</h4>
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

                          <p className="flex flex-col items-center justify-center w-20">
                            <>
                              <span>
                                {new Date(game.matchDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                  }
                                )}
                              </span>
                              <span>
                                {`${new Date(game.matchDate)
                                  .getHours()
                                  .toString()
                                  .padStart(2, "0")}:${new Date(game.matchDate)
                                  .getMinutes()
                                  .toString()
                                  .padStart(2, "0")}`}
                              </span>
                            </>
                          </p>
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
