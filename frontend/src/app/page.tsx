import bg from "@/assets/images/background.jpg";
import mascot from "@/assets/images/mascot.png";
import LeaderboardTable from "@/components/leaderboard-table";
import { MiniMatchesTable } from "@/components/matches-table";
import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-20">
      <div className="relative w-full flex items-center h-40 md:h-48 lg:h-[300px] pl-4 lg:pl-8 py-4 lg:py-16">
        <Image
          src={bg}
          alt="background"
          className="absolute w-[90%] h-40 md:h-48 lg:h-[280px] left-0 z-0"
        />
        <Image
          src={mascot}
          alt="mascot"
          className="absolute w-[230px] md:w-[65%] h-[150%] right-0 z-10"
        />

        <div className="flex relative w-1/2 min-[480px]:w-2/5 flex-col gap-4 lg:gap-8 h-full justify-between text-white">
          <div className="flex flex-col gap-3 lg:gap-6">
            <p className="text-sm sm:text-base md:text-xl lg:text-[26px]/6">
              1. Connect Wallet
            </p>
            <p className="text-xs sm:text-base md:text-xl lg:text-[26px]/6">
              Sign up using Privy and get your in-app wallet
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 [&>*]:cursor-pointer">
            <span className="h-0.5 md:h-1 w-4 md:w-10 bg-[#0080FF]" />
            <span className="h-0.5 md:h-1 w-4 md:w-10 bg-white" />
            <span className="h-0.5 md:h-1 w-4 md:w-10 bg-white" />
            <span className="h-0.5 md:h-1 w-4 md:w-10 bg-white" />
          </div>
        </div>
      </div>
      <LeaderboardTable />
      <MiniMatchesTable />
    </div>
  );
}
