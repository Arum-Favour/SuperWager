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
      updateGameOutcome: (outcome: MatchOutcome, i: number) => void;
      resetSlip: () => void;
      slips: BettingSlip[];
      hasEnteredPool: boolean;
      hasPoolStarted: boolean;
      poolId: string | null;
      hasPoolEnded: boolean;
      hasWon: MatchOutcome;
    }
  | undefined
>(undefined);

const initialState = {
  slips: [],
  hasEnteredPool: false,
  poolId: null,
  hasPoolStarted: false,
  hasPoolEnded: false,
  hasWon: "pending" as MatchOutcome,
};

type GameState = {
  slips: BettingSlip[];
  hasEnteredPool: boolean;
  poolId: string | null;
  hasPoolStarted: boolean;
  hasPoolEnded: boolean;
  hasWon: MatchOutcome;
};

export const BettingSlipsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const resetSlip = () => {
    const history = [
      gameState,
      ...JSON.parse(localStorage.getItem("history") || "[]"),
    ];

    localStorage.setItem("history", JSON.stringify(history));

    setGameState(initialState);
    localStorage.setItem("game", JSON.stringify(gameState));
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
    i: number
  ) => {
    setGameState((prev) => ({
      ...prev,
      slips: prev.slips.map((slip, idx) =>
        idx === i ? { ...slip, outcome } : slip
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
    if (
      !gameState.hasPoolEnded ||
      gameState.hasWon !== "pending" ||
      gameState.slips.length > 0
    )
      return;

    if (gameState.slips.some((slip) => slip.outcome === "lost")) {
      setGameState((prev) => ({ ...prev, hasWon: "lost" }));
      localStorage.setItem("game", JSON.stringify(gameState));
      return;
    }

    if (gameState.slips.every((slip) => slip.outcome === "won")) {
      setGameState((prev) => ({ ...prev, hasWon: "won" }));
      localStorage.setItem("game", JSON.stringify(gameState));
      return;
    }
  }, [gameState.hasPoolEnded, gameState.slips, gameState.hasWon]);

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
