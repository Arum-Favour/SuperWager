import LeaderboardTable from "@/components/ui/leaderboard-table";
import { MiniMatchesTable } from "@/components/ui/matches-table";
import StepsCard from "@/components/ui/steps-card";

export default function Home() {
  return (
    <div className="space-y-20">
      <StepsCard />
      <LeaderboardTable />
      <MiniMatchesTable />
    </div>
  );
}
