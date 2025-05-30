"use client";

import PlayIcon from "@/assets/svgs/play-button";
import { useBettingSlips } from "@/context/useBettingSlips";
import { History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const { slips } = useBettingSlips();

  return (
    <nav className="fixed lg:hidden bottom-0 inset-x-0 bg-black px-[5%] py-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col cursor-pointer items-center">
          <Link
            href="/"
            className={`text-white text-2xl font-bold pb-1 w-[50px] text-center inknut-antiqua ${
              pathname === "/" ? "border-b-[3px] border-b-[var(--primary)]" : ""
            }`}
          >
            S
          </Link>
        </div>
        <div className="flex flex-col cursor-pointer items-center gap-1">
          <PlayIcon
            className={`size-6 ${
              pathname === "/create-slip"
                ? "fill-[var(--primary)]"
                : "fill-white"
            }`}
          />
          <Link
            href="/create-slip"
            className={`${
              pathname === "/create-slip"
                ? "text-[var(--primary)]"
                : "text-white"
            } text-xs sm:text-sm`}
          >
            Create Slip
          </Link>
        </div>
        <div className="flex flex-col cursor-pointer items-center gap-1">
          <p
            className={`${
              pathname === "/betting-slips"
                ? "text-[var(--primary)]"
                : "text-white"
            } text-xl`}
          >
            {slips.length}
          </p>
          <Link
            href="/betting-slips"
            className={`${
              pathname === "/betting-slips"
                ? "text-[var(--primary)]"
                : "text-white"
            } text-xs sm:text-sm`}
          >
            Bet Slip
          </Link>
        </div>
        <div className="flex flex-col cursor-pointer items-center gap-1">
          <History
            className={`size-6 ${
              pathname === "/bet-history"
                ? "stroke-[var(--primary)]"
                : "stroke-white"
            }`}
          />
          <Link
            href="/bet-history"
            className={`${
              pathname === "/bet-history"
                ? "text-[var(--primary)]"
                : "text-white"
            } text-xs sm:text-sm`}
          >
            Bet History
          </Link>
        </div>
      </div>
    </nav>
  );
}
