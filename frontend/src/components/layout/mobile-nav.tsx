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
        <Link href="/" className="flex flex-col cursor-pointer items-center">
          <h2
            className={`text-white text-2xl font-bold pb-1 w-[50px] text-center inknut-antiqua ${
              pathname === "/" ? "border-b-[3px] border-b-[var(--primary)]" : ""
            }`}
          >
            S
          </h2>
        </Link>
        <Link
          href="/create-slip"
          className="flex flex-col cursor-pointer items-center gap-1"
        >
          <PlayIcon
            className={`size-6 ${
              pathname === "/create-slip"
                ? "fill-[var(--primary)]"
                : "fill-white"
            }`}
          />
          <p
            className={`${
              pathname === "/create-slip"
                ? "text-[var(--primary)]"
                : "text-white"
            } text-xs sm:text-sm`}
          >
            Create Slip
          </p>
        </Link>
        <Link
          href="/betting-slips"
          className="flex flex-col cursor-pointer items-center gap-1"
        >
          <p
            className={`${
              pathname === "/betting-slips"
                ? "text-[var(--primary)]"
                : "text-white"
            } text-xl`}
          >
            {slips.length}
          </p>
          <p
            className={`${
              pathname === "/betting-slips"
                ? "text-[var(--primary)]"
                : "text-white"
            } text-xs sm:text-sm`}
          >
            Bet Slip
          </p>
        </Link>
        <Link
          href="/bet-history"
          className="flex flex-col cursor-pointer items-center gap-1"
        >
          <History
            className={`size-6 ${
              pathname === "/bet-history"
                ? "stroke-[var(--primary)]"
                : "stroke-white"
            }`}
          />
          <p
            className={`${
              pathname === "/bet-history"
                ? "text-[var(--primary)]"
                : "text-white"
            } text-xs sm:text-sm`}
          >
            Bet History
          </p>
        </Link>
      </div>
    </nav>
  );
}
