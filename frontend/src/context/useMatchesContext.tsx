"use client";

import { radar_leagues } from "@/utils/constant";
import { fetchMatches, fetchOdds } from "@/utils/queries";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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

  const { data, isLoading, isError } = useQuery<SportEventSchedule>({
    queryKey: ["matches", radar_leagues[league].season_id],
    queryFn: async () => {
      const res = await axios.get(
        `/api/fetch-matches?season_id=${radar_leagues[league].season_id}`
      );
      return res.data;
    },
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
    queryFn: async () => {
      const res = await axios.get(
        `/api/fetch-odds?tournament_id=${radar_leagues[league].odds}`
      );
      return res.data;
    },
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
