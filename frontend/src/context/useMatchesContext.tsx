"use client";

import { radar_leagues } from "@/utils/constant";
import { fetchMatches, fetchOdds } from "@/utils/queries";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

type MatchesContextType = {
  matches: Schedule[];
  odds: SportOddsData["sport_events"];
  league: number;
  next: () => void;
  prev: () => void;
  isLoading: boolean;
  isError: boolean;
  startingDate: string;
  setStartingDate: React.Dispatch<React.SetStateAction<string>>;
};

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const MatchesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [league, setLeague] = useState<number>(0);
  const next = () => {
    if (league === radar_leagues.length - 1) setLeague(0);
    else setLeague((prev) => prev + 1);
  };
  const prev = () => {
    if (league === 0) setLeague(radar_leagues.length - 1);
    else setLeague((prev) => prev - 1);
  };

  const [startingDate, setStartingDate] = useState<string>(
    new Date().toDateString()
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["matches", radar_leagues[league].season_id],
    queryFn: async () => await fetchMatches(radar_leagues[league].season_id),
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 5000,
    // staleTime: 10000,
  });

  const matches =
    data?.schedules?.filter((schedule) => {
      const matchDate = new Date(
        schedule.sport_event.start_time
      ).toDateString();
      return matchDate === new Date(startingDate).toDateString();
    }) || [];

  const { data: odds } = useQuery<SportOddsData>({
    queryKey: ["odds", radar_leagues[league].odds],
    queryFn: async () => await fetchOdds(radar_leagues[league].odds),
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 5000,
  });

  return (
    <MatchesContext.Provider
      value={{
        matches,
        odds: odds?.sport_events || [],
        league,
        next,
        prev,
        isLoading,
        isError,
        startingDate,
        setStartingDate,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};
