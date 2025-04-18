"use client";

import FootballPitchIcon from "@/assets/svgs/football-pitch";
import GreaterThanIcon from "@/assets/svgs/greater-than";
import { BettingSlip, useBettingSlips } from "@/context/useBettingSlips";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const footballMatchesData = {
  liveMatches: [
    {
      id: 1,
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      score: { home: 2, away: 1 },
      odds: { home: 2.1, draw: 3.4, away: 3.2 },
      minute: 64,
    },
    {
      id: 2,
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      score: { home: 0, away: 0 },
      odds: { home: 2.5, draw: 3.3, away: 2.7 },
      minute: 45,
    },
    {
      id: 3,
      homeTeam: "Bayern Munich",
      awayTeam: "Dortmund",
      score: { home: 4, away: 0 },
      odds: { home: 1.4, draw: 4.5, away: 7.0 },
      minute: 78,
    },
    {
      id: 4,
      homeTeam: "Liverpool",
      awayTeam: "Man City",
      score: { home: 1, away: 1 },
      odds: { home: 3.1, draw: 3.5, away: 2.2 },
      minute: 32,
    },
    {
      id: 5,
      homeTeam: "Inter Milan",
      awayTeam: "Juventus",
      score: { home: 1, away: 0 },
      odds: { home: 2.3, draw: 3.1, away: 3.2 },
      minute: 56,
    },
    {
      id: 6,
      homeTeam: "PSG",
      awayTeam: "Marseille",
      score: { home: 2, away: 2 },
      odds: { home: 1.5, draw: 4.0, away: 6.0 },
      minute: 67,
    },
    {
      id: 7,
      homeTeam: "Tottenham",
      awayTeam: "Newcastle",
      score: { home: 0, away: 2 },
      odds: { home: 2.1, draw: 3.4, away: 3.3 },
      minute: 39,
    },
    {
      id: 8,
      homeTeam: "AC Milan",
      awayTeam: "Napoli",
      score: { home: 3, away: 1 },
      odds: { home: 2.8, draw: 3.2, away: 2.5 },
      minute: 72,
    },
    {
      id: 9,
      homeTeam: "Atletico Madrid",
      awayTeam: "Sevilla",
      score: { home: 1, away: 1 },
      odds: { home: 1.8, draw: 3.6, away: 4.5 },
      minute: 51,
    },
    {
      id: 10,
      homeTeam: "Leipzig",
      awayTeam: "Leverkusen",
      score: { home: 0, away: 0 },
      odds: { home: 2.7, draw: 3.5, away: 2.6 },
      minute: 18,
    },
  ],
  upcomingMatches: [
    {
      id: 11,
      homeTeam: "Man United",
      awayTeam: "Aston Villa",
      startTime: "2025-11-12T15:00:00",
      odds: { home: 1.9, draw: 3.6, away: 4.0 },
    },
    {
      id: 12,
      homeTeam: "Roma",
      awayTeam: "Lazio",
      startTime: "2025-11-12T18:00:00",
      odds: { home: 2.4, draw: 3.2, away: 3.0 },
    },
    {
      id: 13,
      homeTeam: "Porto",
      awayTeam: "Benfica",
      startTime: "2025-11-11T20:30:00",
      odds: { home: 2.7, draw: 3.1, away: 2.8 },
    },
    {
      id: 14,
      homeTeam: "Ajax",
      awayTeam: "Feyenoord",
      startTime: "2025-11-12T13:30:00",
      odds: { home: 2.2, draw: 3.5, away: 3.2 },
    },
    {
      id: 15,
      homeTeam: "Celtic",
      awayTeam: "Rangers",
      startTime: "2025-11-11T12:00:00",
      odds: { home: 2.1, draw: 3.3, away: 3.6 },
    },
    {
      id: 16,
      homeTeam: "Boca Juniors",
      awayTeam: "River Plate",
      startTime: "2025-11-13T22:00:00",
      odds: { home: 2.5, draw: 3.0, away: 3.0 },
    },
    {
      id: 17,
      homeTeam: "Galatasaray",
      awayTeam: "Fenerbahçe",
      startTime: "2025-11-12T19:00:00",
      odds: { home: 2.3, draw: 3.4, away: 3.1 },
    },
    {
      id: 18,
      homeTeam: "LA Galaxy",
      awayTeam: "LAFC",
      startTime: "2025-11-13T03:30:00",
      odds: { home: 3.2, draw: 3.5, away: 2.2 },
    },
    {
      id: 19,
      homeTeam: "Flamengo",
      awayTeam: "Palmeiras",
      startTime: "2025-11-14T23:00:00",
      odds: { home: 2.1, draw: 3.2, away: 3.7 },
    },
    {
      id: 20,
      homeTeam: "Al Hilal",
      awayTeam: "Al Nassr",
      startTime: "2025-11-11T17:00:00",
      odds: { home: 2.6, draw: 3.3, away: 2.7 },
    },
  ],
};

const updateLiveMatches = (matches: typeof footballMatchesData.liveMatches) => {
  return matches.map((match) => {
    if (!match.score) return match;

    const updated = { ...match };

    updated.minute = Math.min(
      90,
      updated.minute + Math.floor(Math.random() * 3) + 1
    );

    if (Math.random() < 0.005) {
      if (Math.random() < 0.5) {
        updated.score.home += 1;
        updated.odds.home = Math.max(
          1.1,
          +(updated.odds.home * 0.9).toFixed(2)
        );
        updated.odds.away = Math.max(
          1.1,
          +(updated.odds.away * 1.1).toFixed(2)
        );
      } else {
        updated.score.away += 1;
        updated.odds.away = Math.max(
          1.1,
          +(updated.odds.away * 0.9).toFixed(2)
        );
        updated.odds.home = Math.max(
          1.1,
          +(updated.odds.home * 1.1).toFixed(2)
        );
      }
      updated.odds.draw = Math.max(1.1, +(updated.odds.draw * 1.05).toFixed(2));
    }

    updated.odds.home = Math.max(
      1.1,
      +(updated.odds.home * (0.98 + Math.random() * 0.04)).toFixed(2)
    );
    updated.odds.draw = Math.max(
      1.1,
      +(updated.odds.draw * (0.98 + Math.random() * 0.04)).toFixed(2)
    );
    updated.odds.away = Math.max(
      1.1,
      +(updated.odds.away * (0.98 + Math.random() * 0.04)).toFixed(2)
    );

    return updated;
  });
};

export default function MatchesTable() {
  const router = useRouter();
  const params = useSearchParams();

  const [activeTab, setActiveTab] = useState<"live" | "upcoming">(
    (params.get("tab") as "live" | "upcoming") || "live"
  );

  const [matches, setMatches] = useState(footballMatchesData);

  const handleTabClick = (tab: "live" | "upcoming") => {
    setActiveTab(tab);
    router.replace("/create-slip");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) => ({
        liveMatches: updateLiveMatches(prev.liveMatches),
        upcomingMatches: prev.upcomingMatches,
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    toast.info("Select upcoming matches to create slip");
  }, []);

  const { addSlip, removeSlip, slips, hasPoolStarted, setPoolId } =
    useBettingSlips();

  const addToSlip = (match: BettingSlip) => {
    if (hasPoolStarted) {
      toast.error("You cannot make changes to the pool");
      return;
    }

    if (
      slips.some(
        (s) => s.homeTeam === match.homeTeam && s.awayTeam === match.awayTeam
      )
    ) {
      toast.error("Match already in slip");
      return;
    }

    addSlip(match);
  };

  const removeFromSlip = (slip: Partial<BettingSlip>) => {
    if (hasPoolStarted) {
      toast.error("You cannot make changes to the pool");
      return;
    }

    removeSlip(slip as BettingSlip);
  };

  const createSlip = () => {
    if (!slips.length) {
      toast.error("No matches in slip");
      return;
    }

    setPoolId(Date.now().toString());

    toast.success("Slip successfully created");

    router.push("/betting-slips");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-4xl">Football</h2>

        <button
          onClick={createSlip}
          className="text-lg font-normal bg-[var(--primary)] rounded-lg py-3 px-4 text-white capitalize hover:bg-[var(--primary)]/80"
        >
          Create Slip
        </button>
      </div>
      <div className="flex w-full">
        <div
          className="flex-1 flex items-center justify-center relative p-4 cursor-pointer hover:bg-[var(--primary-light)]"
          onClick={() => handleTabClick("live")}
        >
          <p
            className={`text-xl ${
              activeTab === "live" ? "text-[var(--primary)]" : ""
            }`}
          >
            Live Matches{" "}
            <span className="text-[#33ff40]">
              ({matches.liveMatches.length})
            </span>
          </p>
          {activeTab === "live" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)] transition-transform duration-300 transform translate-y-0" />
          )}
        </div>
        <div
          className="flex-1 flex items-center justify-center relative p-4 cursor-pointer hover:bg-[var(--primary-light)]"
          onClick={() => handleTabClick("upcoming")}
        >
          <p
            className={`text-xl ${
              activeTab === "upcoming" ? "text-[var(--primary)]" : ""
            }`}
          >
            Upcoming Matches
          </p>
          {activeTab === "upcoming" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)] transition-transform duration-300 transform translate-y-0" />
          )}
        </div>
      </div>
      <div>
        {activeTab === "live"
          ? matches.liveMatches.map((match) => (
              <div
                key={match.id}
                className="w-full px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center justify-center text-[#32ff40]">
                    <span className="text-base">{match.minute}&apos;</span>
                    <span className="text-sm">
                      {match.minute < 46 ? "1st" : "2nd"}
                    </span>
                  </div>
                  <div className="text-xl flex flex-col gap-2 justify-center">
                    <span>{match.homeTeam}</span>
                    <span>{match.awayTeam}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-xl flex flex-col gap-2 items-center justify-center">
                    <span>{match.score.home}</span>
                    <span>{match.score.away}</span>
                  </div>
                  <span>
                    <FootballPitchIcon />
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">1</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.home.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">X</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.draw.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">2</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.away.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="cursor-pointer">
                    <GreaterThanIcon />
                  </span>
                </div>
              </div>
            ))
          : matches.upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="w-full px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center justify-center">
                    <p>
                      {`${new Date(match.startTime)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${new Date(match.startTime)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`}
                    </p>
                  </div>
                  <div className="text-xl flex flex-col gap-2 justify-center">
                    <span>{match.homeTeam}</span>
                    <span>{match.awayTeam}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-xl flex flex-col gap-2 items-center justify-center">
                    <span>-</span>
                    <span>-</span>
                  </div>
                  <span>
                    <FootballPitchIcon />
                  </span>
                  <div className="flex items-center gap-4 [&>div>p:nth-child(2)]:cursor-pointer">
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">1</p>
                      <p
                        className={`${
                          slips.find(
                            (item) =>
                              item.homeTeam === match.homeTeam &&
                              item.awayTeam === match.awayTeam &&
                              item.selection === "home"
                          )
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--primary-light)]"
                        } p-2.5 rounded-sm`}
                        onClick={() => {
                          slips.find(
                            (item) =>
                              item.homeTeam === match.homeTeam &&
                              item.awayTeam === match.awayTeam &&
                              item.selection === "home"
                          )
                            ? removeFromSlip({
                                awayTeam: match.awayTeam,
                                homeTeam: match.homeTeam,
                                selection: "home",
                              })
                            : addToSlip({
                                awayTeam: match.awayTeam,
                                homeTeam: match.homeTeam,
                                matchDate: new Date(match.startTime).toString(),
                                odds: match.odds.home,
                                outcome: "pending",
                                selection: "home",
                              });
                        }}
                      >
                        {match.odds.home.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">X</p>
                      <p
                        className={`${
                          slips.find(
                            (item) =>
                              item.homeTeam === match.homeTeam &&
                              item.awayTeam === match.awayTeam &&
                              item.selection === "draw"
                          )
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--primary-light)]"
                        } p-2.5 rounded-sm`}
                        onClick={() => {
                          slips.find(
                            (item) =>
                              item.homeTeam === match.homeTeam &&
                              item.awayTeam === match.awayTeam &&
                              item.selection === "draw"
                          )
                            ? removeFromSlip({
                                awayTeam: match.awayTeam,
                                homeTeam: match.homeTeam,
                                selection: "draw",
                              })
                            : addToSlip({
                                awayTeam: match.awayTeam,
                                homeTeam: match.homeTeam,
                                matchDate: new Date(match.startTime).toString(),
                                odds: match.odds.draw,
                                outcome: "pending",
                                selection: "draw",
                              });
                        }}
                      >
                        {match.odds.draw.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">2</p>
                      <p
                        className={`${
                          slips.find(
                            (item) =>
                              item.homeTeam === match.homeTeam &&
                              item.awayTeam === match.awayTeam &&
                              item.selection === "away"
                          )
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--primary-light)]"
                        } p-2.5 rounded-sm`}
                        onClick={() => {
                          slips.find(
                            (item) =>
                              item.homeTeam === match.homeTeam &&
                              item.awayTeam === match.awayTeam &&
                              item.selection === "away"
                          )
                            ? removeFromSlip({
                                awayTeam: match.awayTeam,
                                homeTeam: match.homeTeam,
                                selection: "away",
                              })
                            : addToSlip({
                                awayTeam: match.awayTeam,
                                homeTeam: match.homeTeam,
                                matchDate: new Date(match.startTime).toString(),
                                odds: match.odds.away,
                                outcome: "pending",
                                selection: "away",
                              });
                        }}
                      >
                        {match.odds.away.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="cursor-pointer">
                    <GreaterThanIcon />
                  </span>
                </div>
              </div>
            ))}
      </div>
      <div className="flex items-center justify-center mt-6">
        <button
          onClick={createSlip}
          className="text-lg font-normal bg-[var(--primary)] rounded-lg py-3 px-4 text-white capitalize hover:bg-[var(--primary)]/80"
        >
          Create Slip
        </button>
      </div>
    </div>
  );
}

export function MiniMatchesTable() {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming">("live");

  const handleTabClick = (tab: "live" | "upcoming") => {
    setActiveTab(tab);
  };

  const [matches, setMatches] = useState({
    liveMatches: footballMatchesData.liveMatches.slice(0, 5),
    upcomingMatches: footballMatchesData.upcomingMatches.slice(0, 5),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) => ({
        liveMatches: updateLiveMatches(prev.liveMatches).slice(0, 5),
        upcomingMatches: prev.upcomingMatches.slice(0, 5),
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl lg:text-4xl">Football</h2>
      </div>
      <div className="flex w-full">
        <div
          className="flex-1 flex items-center justify-center relative p-4 cursor-pointer hover:bg-[var(--primary-light)]"
          onClick={() => handleTabClick("live")}
        >
          <p
            className={`md:text-xl ${
              activeTab === "live" ? "text-[var(--primary)]" : ""
            }`}
          >
            Live Matches{" "}
            <span className="text-[#33ff40]">
              ({matches.liveMatches.length})
            </span>
          </p>
          {activeTab === "live" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)] transition-transform duration-300 transform translate-y-0" />
          )}
        </div>
        <div
          className="flex-1 flex items-center justify-center relative p-4 cursor-pointer hover:bg-[var(--primary-light)]"
          onClick={() => handleTabClick("upcoming")}
        >
          <p
            className={`md:text-xl ${
              activeTab === "upcoming" ? "text-[var(--primary)]" : ""
            }`}
          >
            Upcoming Matches
          </p>
          {activeTab === "upcoming" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)] transition-transform duration-300 transform translate-y-0" />
          )}
        </div>
      </div>
      <div>
        {activeTab === "live"
          ? matches.liveMatches.map((match) => (
              <div
                key={match.id}
                className="w-full md:px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 md:gap-8">
                  <div className="flex flex-col items-center justify-center text-[#32ff40]">
                    <span className="text-base">{match.minute}&apos;</span>
                    <span className="text-sm">
                      {match.minute < 46 ? "1st" : "2nd"}
                    </span>
                  </div>
                  <div className="md:text-xl flex flex-col gap-2 justify-center">
                    <span>{match.homeTeam}</span>
                    <span>{match.awayTeam}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-8">
                  <div className="md:text-xl flex flex-col gap-2 items-center justify-center">
                    <span>{match.score.home}</span>
                    <span>{match.score.away}</span>
                  </div>
                  <span>
                    <FootballPitchIcon />
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">1</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.home.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">X</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.draw.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">2</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.away.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="cursor-pointer">
                    <GreaterThanIcon />
                  </span>
                </div>
              </div>
            ))
          : matches.upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="w-full md:px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-1 md:gap-8">
                  <div className="flex flex-col items-center justify-center">
                    <p>
                      {`${new Date(match.startTime)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${new Date(match.startTime)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`}
                    </p>
                  </div>
                  <div className="md:text-xl flex flex-col gap-2 justify-center">
                    <span>{match.homeTeam}</span>
                    <span>{match.awayTeam}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:gap-8">
                  <div className="text-xl flex flex-col gap-2 items-center justify-center">
                    <span>-</span>
                    <span>-</span>
                  </div>
                  <span>
                    <FootballPitchIcon />
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">1</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.home.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">X</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.draw.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">2</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.away.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="cursor-pointer">
                    <GreaterThanIcon />
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
