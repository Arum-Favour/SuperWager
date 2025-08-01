"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthModal } from "./AuthModalContext";
import { currentBet, updateBetStatus } from "@/lib/firebase/firestore";
import { toast } from "sonner";

const BettingSlipsContext = createContext<
  | (GameState & {
      addSlip: (slip: BettingSlip) => void;
      removeSlip: (slip: BettingSlip) => void;
      setHasEnteredPool: (val: boolean) => void;
      updateSlipStatus: (val: boolean) => void;
      setPoolId: () => void;
      updateGameOutcome: (
        outcome: MatchOutcome,
        i: number,
        finalHomeScore: number,
        finalAwayScore: number
      ) => void;
      resetSlip: () => void;
    })
  | undefined
>(undefined);

const initialState: GameState = {
  slips: [],
  hasEnteredPool: false,
  poolId: null,
  hasPoolStarted: false,
  hasPoolEnded: false,
};

export const BettingSlipsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    userData: { walletAddress },
  } = useAuthModal();

  const [gameState, setGameState] = useState<GameState>(initialState);
  const [currentBetId, setCurrentBetId] = useState("");

  useEffect(() => {
    if (walletAddress)
      currentBet(walletAddress)
        .then((res) => {
          if (res) {
            setGameState({
              slips: res.slips,
              hasEnteredPool: res.hasEnteredPool,
              hasPoolEnded: res.hasPoolEnded,
              hasPoolStarted: res.hasPoolStarted,
              poolId: res.poolId,
            });
            setCurrentBetId(res.id);
          }
        })
        .catch((err) => console.log(err));
  }, [walletAddress]);

  const resetSlip = () => {
    updateBetStatus(currentBetId, gameState, walletAddress)
      .then(() => {
        setGameState(initialState);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error updating slips details");
      });
  };

  const addSlip = async (slip: BettingSlip) => {
    const updatedState = {
      ...gameState,
      slips: [
        ...gameState.slips,
        { ...slip, matchDate: new Date(slip.matchDate).toISOString() },
      ],
    };
    setGameState(updatedState);
  };

  const removeSlip = async (slip: Partial<BettingSlip>) => {
    const updatedSlips = gameState.slips.filter(
      (s) =>
        s.homeTeam !== slip.homeTeam &&
        s.awayTeam !== slip.awayTeam &&
        s.odds !== slip.odds
    );
    const updatedState = {
      ...gameState,
      slips: updatedSlips,
      poolId: updatedSlips.length === 0 ? null : gameState.poolId,
      hasEnteredPool:
        updatedSlips.length === 0 ? false : gameState.hasEnteredPool,
    };

    setGameState(updatedState);
  };

  const setPoolId = () => {
    setGameState((prev) => ({ ...prev, poolId: Date.now().toString() }));
  };

  const setHasEnteredPool = (val: boolean) => {
    setGameState((prev) => ({ ...prev, hasEnteredPool: val }));
  };

  const updateSlipStatus = (hasPoolEnded: boolean) => {
    const updatedSlips: GameState = { ...gameState, hasPoolEnded };
    setGameState(updatedSlips);
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
  };

  useEffect(() => {
    if (gameState.hasPoolStarted || gameState.slips.length === 0) return;

    const interval = setInterval(() => {
      const hasStarted = gameState.slips.some(
        (slip) => new Date(slip.matchDate) <= new Date()
      );
      if (hasStarted) {
        if (!gameState.hasEnteredPool) {
          setGameState(initialState);

          clearInterval(interval);
          return;
        }
        setGameState((prev) => ({ ...prev, hasPoolStarted: true }));
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState.slips, gameState.hasEnteredPool, gameState.hasPoolStarted]);

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
