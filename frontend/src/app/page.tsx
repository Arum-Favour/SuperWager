import LeaderboardTable from "@/components/leaderboard-table";
import { MiniMatchesTable } from "@/components/matches-table";
import StepsCard from "@/components/steps-card";

export default function Home() {
  return (
    <div className="space-y-20">
      <StepsCard />
      <LeaderboardTable />
      <MiniMatchesTable />
    </div>
  );
}
