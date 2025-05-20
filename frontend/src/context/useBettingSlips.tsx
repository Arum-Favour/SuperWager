"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const BettingSlipsContext = createContext<
  | {
      addSlip: (slip: BettingSlip) => void;
      removeSlip: (slip: BettingSlip) => void;
      setHasEnteredPool: (val: boolean) => void;
      updateSlipStatus: (val: boolean) => void;
      setPoolId: (val: string) => void;
      updateGameOutcome: (
        outcome: MatchOutcome,
        i: number,
        finalHomeScore: number,
        finalAwayScore: number
      ) => void;
      resetSlip: () => void;
      setSlipOutcome: () => void;
      slips: BettingSlip[];
      hasEnteredPool: boolean;
      hasPoolStarted: boolean;
      poolId: string | null;
      hasPoolEnded: boolean;
      hasWon: MatchOutcome;
    }
  | undefined
>(undefined);

const initialState: GameState = {
  slips: [],
  hasEnteredPool: false,
  poolId: null,
  hasPoolStarted: false,
  hasPoolEnded: false,
  hasWon: "pending",
};

export const BettingSlipsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const setSlipOutcome = () => {
    const updatedSlips: GameState = {
      ...gameState,
      hasWon: gameState.slips.some((slip) => slip.outcome === "lost")
        ? "lost"
        : gameState.slips.some((slip) => slip.outcome === "pending")
        ? "pending"
        : "won",
    };

    setGameState(updatedSlips);
    localStorage.setItem("game", JSON.stringify(updatedSlips));
  };

  const resetSlip = () => {
    const history = [
      gameState,
      ...JSON.parse(localStorage.getItem("history") || "[]"),
    ];

    localStorage.setItem("history", JSON.stringify(history));

    setGameState(initialState);
    localStorage.setItem("game", JSON.stringify(initialState));
  };

  const addSlip = (slip: BettingSlip) => {
    setGameState((prev) => ({
      ...prev,
      slips: [
        ...prev.slips,
        { ...slip, matchDate: new Date(slip.matchDate).toISOString() },
      ],
    }));
    localStorage.setItem("game", JSON.stringify(gameState));
  };

  const removeSlip = (slip: Partial<BettingSlip>) => {
    const updatedSlips = gameState.slips.filter(
      (s) =>
        s.homeTeam !== slip.homeTeam &&
        s.awayTeam !== slip.awayTeam &&
        s.odds !== slip.odds
    );
    setGameState((prev) => ({
      ...prev,
      slips: updatedSlips,
      poolId: updatedSlips.length === 0 ? null : prev.poolId,
      hasEnteredPool: updatedSlips.length === 0 ? false : prev.hasEnteredPool,
    }));
    localStorage.setItem("game", JSON.stringify(gameState));
  };

  const setPoolId = (id: string) => {
    setGameState((prev) => ({ ...prev, poolId: id }));
    localStorage.setItem("game", JSON.stringify(gameState));
  };

  const setHasEnteredPool = (val: boolean) => {
    setGameState((prev) => ({ ...prev, hasEnteredPool: val }));
    localStorage.setItem("game", JSON.stringify(gameState));
  };

  const updateSlipStatus = (val: boolean) => {
    setGameState((prev) => ({ ...prev, hasPoolEnded: val }));
    localStorage.setItem("game", JSON.stringify(gameState));
  };

  const updateGameOutcome = (
    outcome: "pending" | "won" | "lost",
    i: number,
    finalHomeScore: number,
    finalAwayScore: number
  ) => {
    setGameState((prev) => ({
      ...prev,
      slips: prev.slips.map((slip, idx) =>
        idx === i ? { ...slip, outcome, finalHomeScore, finalAwayScore } : slip
      ),
    }));
    localStorage.setItem("game", JSON.stringify(gameState));
  };

  useEffect(() => {
    if (gameState.hasPoolStarted) return;

    const interval = setInterval(() => {
      if (gameState.slips.length === 0) return;
      const hasStarted = gameState.slips.some(
        (slip) => new Date(slip.matchDate) <= new Date()
      );
      if (hasStarted && gameState.hasEnteredPool) {
        setGameState((prev) => ({ ...prev, hasPoolStarted: true }));
        localStorage.setItem("game", JSON.stringify(gameState));

        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState.slips, gameState.hasEnteredPool, gameState.hasPoolStarted]);

  useEffect(() => {
    const storedGameState = localStorage.getItem("game");
    if (storedGameState) setGameState(JSON.parse(storedGameState));
  }, []);

  return (
    <BettingSlipsContext.Provider
      value={{
        addSlip,
        removeSlip,
        setPoolId,
        setHasEnteredPool,
        updateSlipStatus,
        updateGameOutcome,
        resetSlip,
        setSlipOutcome,
        ...gameState,
      }}
    >
      {children}
    </BettingSlipsContext.Provider>
  );
};

export const useBettingSlips = () => {
  const context = useContext(BettingSlipsContext);
  if (!context) {
    throw new Error(
      "useBettingSlips must be used within a BettingSlipsProvider"
    );
  }
  return context;
};
