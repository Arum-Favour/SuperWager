export const buildMatchesUrl = (season_id: string) =>
  `https://api.sportradar.com/soccer/trial/v4/en/seasons/${season_id}/schedules.json`;
export const buildOddsUrl = (tournament_id: string) =>
  `https://api.sportradar.com/oddscomparison-ust1/en/eu/tournaments/${tournament_id}/schedule.json`;

const getDateLabel = (date: Date, index: number) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return date.toLocaleString("en-US", { month: "short", day: "numeric" });
};

export const daysArray = Array.from({ length: 5 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    label: getDateLabel(date, i),
    date: date.toDateString(),
  };
});

export const base_url = process.env.BASE_URL || "http://localhost:3000";

export const calcScore = (slips: BettingSlip[]) => {
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

  console.log("odds won", oddsWon);

  return (oddsWon / totalOdds) * oddsWon;
};
