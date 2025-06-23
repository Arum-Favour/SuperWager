import soccer from "@/assets/images/soccer.webp";
import CancelXIcon from "@/assets/svgs/cancel-x";
import EditIcon from "@/assets/svgs/edit-icon";
import GreenCheckIcon from "@/assets/svgs/green-check";
import { PendingIconBlack, PendingIconBlue } from "@/assets/svgs/pending";
import RedXIcon from "@/assets/svgs/red-x";
import { useBettingSlips } from "@/context/useBettingSlips";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SlipCard({
  game,
  scoresData,
  idx,
}: {
  game: BettingSlip;
  scoresData: Schedule[];
  idx: number;
}) {
  const router = useRouter();

  const { hasEnteredPool, removeSlip, updateGameOutcome } = useBettingSlips();

  const [matchOutcome, setMatchOutcome] = useState<MatchOutcome>("pending");

  useEffect(() => {
    if (!scoresData.length) return;

    const match = scoresData[idx];

    const homeScore = match?.sport_event_status.home_score as number;
    const awayScore = match?.sport_event_status.away_score as number;

    if (
      !match ||
      new Date(match.sport_event.start_time) > new Date() ||
      match.sport_event_status.match_status !== "ended"
    )
      return;

    const selection = game.selection.toLowerCase();
    const isHomeWin = homeScore > awayScore;
    const isAwayWin = homeScore < awayScore;
    const isDraw = homeScore === awayScore;

    if (
      (selection === "home" && isHomeWin) ||
      (selection === "away" && isAwayWin) ||
      (selection === "draw" && isDraw)
    ) {
      updateGameOutcome("won", idx, homeScore, awayScore);
      setMatchOutcome("won");
      return;
    } else {
      updateGameOutcome("lost", idx, homeScore, awayScore);
      setMatchOutcome("lost");
      return;
    }
  }, [scoresData]);

  return (
    <div
      className={`${
        matchOutcome === "won"
          ? "bg-[#32FF401A]"
          : matchOutcome === "lost"
          ? "bg-[#F9070B1A]"
          : "bg-white/50"
      } p-4 md:p-6 flex flex-col justify-between gap-6 md:gap-8 rounded-4xl`}
    >
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-6">
          <Image
            src={soccer}
            alt="image of a soccerball"
            className="size-6 sm:size-8 md:size-12"
          />

          <p className="flex flex-col items-center justify-center text-xs sm:text-sm md:text-base">
            {(() => {
              const match = scoresData[idx];

              if (!match) return "";

              if (match.sport_event_status.match_status === "ended")
                return "FT";
              if (match.sport_event_status.status === "live")
                return (
                  <>
                    <span className="text-[#32FF40]">
                      {match.sport_event_status.clock?.played}
                    </span>
                    <span className="capitalize text-[#32FF40]">
                      {match.sport_event_status.match_status === "1st_half"
                        ? "1st"
                        : match.sport_event_status.match_status === "halftime"
                        ? "HT"
                        : "2nd"}
                    </span>
                  </>
                );

              return (
                <>
                  <span>
                    {new Date(match.sport_event.start_time).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      }
                    )}
                  </span>
                  <span>
                    {`${new Date(match.sport_event.start_time)
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${new Date(
                      match.sport_event.start_time
                    )
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`}
                  </span>
                </>
              );
            })()}
          </p>
        </div>
        <div className="flex gap-8 md:gap-16">
          {hasEnteredPool ? (
            <span>
              {matchOutcome === "won" && (
                <GreenCheckIcon className="size-4 sm:size-6 md:size-7" />
              )}
              {matchOutcome === "lost" && (
                <RedXIcon className="size-4 sm:size-6 md:size-7" />
              )}

              {matchOutcome === "pending" &&
                (!scoresData[idx] ||
                  new Date(scoresData[idx].sport_event.start_time) >
                    new Date()) && (
                  <PendingIconBlack className="size-4 md:size-6" />
                )}
              {matchOutcome === "pending" &&
                !(
                  !scoresData[idx] ||
                  new Date(scoresData[idx].sport_event.start_time) > new Date()
                ) && <PendingIconBlue className="size-4 md:size-6" />}
            </span>
          ) : (
            <>
              <p
                className="flex gap-2 text-xs sm:text-sm md:text-2xl text-[var(--primary)] cursor-pointer"
                onClick={() => router.push("/create-slip")}
                title="edit game on slip"
              >
                Edit <EditIcon className="size-4 md:size-[30px]" />
              </p>
              <span
                title="remove game from slip"
                onClick={() => {
                  removeSlip(game);
                }}
              >
                <CancelXIcon className="cursor-pointer size-3 sm:size-4 md:size-[26px]" />
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="flex flex-col gap-4 md:gap-8 text-xs sm:text-sm md:text-base">
          <div className="flex gap-6 sm:gap-8 md:gap-16 justify-between md:w-64">
            <p>{game.homeTeam}</p>
            <p className="font-medium">
              {scoresData[idx]?.sport_event_status.home_score ?? "-"}
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8 md:gap-16 justify-between md:w-64">
            <p>{game.awayTeam}</p>
            <p className="font-medium">
              {scoresData[idx]?.sport_event_status.away_score ?? "-"}
            </p>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-8 md:gap-16 mt-auto capitalize text-xs sm:text-sm md:text-xl">
          <p>{game.selection}</p>
          <p className="font-medium">{parseFloat(game.odds).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
