"use client";

import TrophyIcon from "@/assets/svgs/trophy";
import { useAuthModal } from "@/context/AuthModalContext";
import { useBettingSlips } from "@/context/useBettingSlips";
import { fetchMatches } from "@/utils/queries";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import EnterPoolModal from "./enter-pool-modal";
import Loader from "./loader";
import SlipCard from "./slip-card";

const calcScore = (slips: BettingSlip[]) => {
  if (!slips.length) return 0;

  const totalOdds = slips.reduce((acc, slip) => {
    const odds = parseFloat(slip.odds) || 0;
    return acc + odds;
  }, 0);

  if (totalOdds <= 0) return 0;

  const oddsWon = slips.reduce(
    (acc, slip) => acc + (slip.outcome === "won" ? parseFloat(slip.odds) : 0),
    0
  );

  return (oddsWon / totalOdds) * oddsWon;
};

export default function BettingSlip() {
  const router = useRouter();

  const {
    slips,
    poolId,
    hasEnteredPool,
    hasPoolEnded,
    updateSlipStatus,
    resetSlip,
    hasPoolStarted,
  } = useBettingSlips();

  const { userData } = useAuthModal();

  const [showEnterPoolModal, setShowEnterPoolModal] = useState(false);

  const close = () => setShowEnterPoolModal(false);

  const [betslipLeagues, setBetslipLeagues] = useState<string[]>([]);

  useEffect(() => {
    if (slips.length)
      setBetslipLeagues([...new Set(slips.map((slip) => slip.league_key))]);
  }, [slips]);

  const { data: scoresData = [], isLoading } = useQuery({
    queryKey: ["scores", betslipLeagues],
    queryFn: async () => {
      const results = await Promise.all(
        betslipLeagues.map(async (league) => fetchMatches(league))
      );

      const flattedResult = results.map((res) => res.schedules).flat();

      const slipMatches = slips
        .map((slip) =>
          flattedResult.find(
            (match) =>
              match.sport_event.competitors[0].name === slip.homeTeam &&
              match.sport_event.competitors[1].name === slip.awayTeam
          )
        )
        .filter(Boolean) as Schedule[];

      return slipMatches;
    },
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 5000,
    // staleTime: 10000,
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!hasPoolStarted || !scoresData.length || hasPoolEnded) return;

    const checkPoolEnded = () => {
      const hasPoolEnded = scoresData.every(
        (match) => match?.sport_event_status.match_status === "ended"
      );

      if (hasPoolEnded) updateSlipStatus(hasPoolEnded);
    };

    checkPoolEnded();
    const intervalId = setInterval(checkPoolEnded, 5000);
    return () => clearInterval(intervalId);
  }, [scoresData, hasPoolEnded]);

  useEffect(() => {
    if (!hasPoolEnded || !slips.length) return;

    setShowConfetti(hasPoolEnded);
  }, [hasPoolEnded]);

  if (!userData.user_id)
    return (
      <div className="my-8">
        <p className="text-center text-2xl font-medium">
          Please Log in to view your betting slip.
        </p>
      </div>
    );

  if (!slips.length)
    return (
      <p className="text-center text-2xl font-medium">
        No betting slip available,{" "}
        <Link href={"/create-slip"} className="text-[var(--primary)]">
          Create Slip
        </Link>
      </p>
    );

  return (
    <>
      {hasPoolEnded && (
        <div className="fixed inset-0 items-center justify-center flex z-50 p-4">
          <div className="absolute inset-0 bg-black/50" />
          <div className="bg-white rounded-4xl p-8 relative flex flex-col items-center justify-center gap-6 md:gap-10 max-w-lg w-full">
            <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-[var(--primary)] font-sembold">
              Congratulations
            </h4>
            <div>
              <TrophyIcon />
            </div>
            <div className="flex items-center justify-center gap-2 flex-col">
              <p>You finished 12th in the pool</p>
              <p>Total points obtained: {calcScore(slips).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Link href={"/leaderboard"}>
                <button className="border border-[var(--primary)] rounded-lg px-3.5 py-4 md:text-lg text-[var(--primary)]">
                  Check leaderboard
                </button>
              </Link>

              <button
                onClick={resetSlip}
                className="md:text-lg bg-[var(--primary)] rounded-lg px-3.5 py-4 text-white hover:bg-[var(--primary)]/80"
              >
                Open betslip
              </button>
            </div>
          </div>
        </div>
      )}
      {showEnterPoolModal && <EnterPoolModal close={close} />}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          initialVelocityY={10}
          colors={[
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF00FF",
            "#00FFFF",
          ]}
          wind={0.01}
        />
      )}
      <div className="bg-[var(--primary-light)] rounded-2xl py-3 md:py-6 px-4 md:px-8 flex flex-col gap-6 sm:gap-10 md:gap-16">
        <div className="w-full flex max-[480px]:flex-col gap-y-4 justify-between">
          <div className="flex justify-between gap-y-2 flex-col">
            <h2 className="text-base sm:text-xl md:text-3xl flex flex-wrap gap-2">
              Betting Slip
              <span className="bg-white py-0.5 px-1.5 md:px-2.5 text-sm sm:text-lg md:text-2xl rounded-[6px] text-black/50">
                {poolId}
              </span>
            </h2>
            <p className="flex flex-wrap gap-y-2 gap-x-4 md:gap-x-6 text-sm md:text-base">
              <span>Total Games: {slips.length}</span>
              <span>
                Total Odds:{" "}
                {slips
                  .reduce((acc, slip) => acc + parseFloat(slip.odds), 0)
                  .toFixed(2)}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {!hasEnteredPool && (
              <button
                disabled={isLoading}
                onClick={() => {
                  if (hasEnteredPool) router.push("/create-slip");
                  else setShowEnterPoolModal(true);
                }}
                className="w-fit text-sm md:text-lg bg-[var(--primary)] rounded-md sm:rounded-lg px-2 sm:px-3.5 py-2.5 sm:py-4 text-white capitalize hover:bg-[var(--primary)]/80"
              >
                Enter Pool
              </button>
            )}
            <p className="min-[480px]:self-end text-xs md:text-base">
              Pool: 0.1 SST
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="w-full p-8 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            slips.map((game, i) => (
              <SlipCard key={i} idx={i} game={game} scoresData={scoresData} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
