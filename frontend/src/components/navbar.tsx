"use client";

import { CircleX, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import Image from "next/image";
import EditIcon from "@/assets/svgs/edit-icon";
import WalletIcon from "@/assets/svgs/wallet-icon";
import TicketIcon from "@/assets/svgs/ticket-icon";
import PlayIcon from "@/assets/svgs/play-button";
import HistoryIcon from "@/assets/svgs/history-icon";
import basketball from "@/assets/images/basketball.png";
import cricket from "@/assets/images/cricket.png";
import football from "@/assets/images/football.png";
import hockey from "@/assets/images/ice-hockey.png";
import rugby from "@/assets/images/rugby.png";
import target from "@/assets/images/target.png";
import tennis from "@/assets/images/tennis.png";
import volleyball from "@/assets/images/volleyball.png";
import XICon from "@/assets/svgs/twitter";
import LinkedinIcon from "@/assets/svgs/linkedin";
import InstagramIcon from "@/assets/svgs/instagram";
import FacebookIcon from "@/assets/svgs/facebook";

export default function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const { openModal } = useAuthModal();

  interface NavLink {
    label: string;
    href?: string;
  }

  return (
    <nav className="w-full max-w-screen-3xl mx-auto px-[5%] py-4 xl:py-8">
      <div
        className={`${
          showNav
            ? "block xl:hidden opacity-100 fixed inset-0 w-full h-full bg-[#0000008e]  transition-all duration-300 z-10"
            : "opacity-0 hidden"
        }`}
      />
      <header className="flex items-center justify-between">
        {/* nav-logo */}
        <h1 className="text-xl font-bold text-[var(--primary)] inknut-antiqua">
          Superwager
        </h1>
        <div className="hidden xl:flex gap-10 items-center">
          {navLinks.map((item: NavLink, i: number) => (
            <React.Fragment key={i}>
              {item.href && (
                <Link
                  href={item.href}
                  className="font-medium text-black hover:text-[var(--primary)] transition-all duration-300 ease-in-out text-lg"
                >
                  {item.label}
                </Link>
              )}
              {item.label == "Login" && (
                <button
                  onClick={openModal}
                  className="border border-[var(--primary)] px-4 py-1 text-lg font-medium rounded-md hover:text-[var(--primary)] transition-colors duration-300"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        <div
          className="xl:hidden cursor-pointer"
          onClick={() => setShowNav((prev) => !prev)}
        >
          <Menu className="size-8 md:size-12 text-[var(--primary)]" />
        </div>
      </header>
      {/* mobile links */}
      <div
        className={`${
          showNav
            ? "translate-x-0 flex max-sm:w-full w-[50%]"
            : "translate-x-[200%]"
        } xl:hidden transition-transform duration-500 transform fixed inset-0 z-40 flex-col gap-4 items-center bg-white left-auto max-sm:space-y-1 space-y-2`}
      >
        <div
          className="cursor-pointer self-end pr-[5%] pt-4"
          onClick={() => setShowNav((prev) => !prev)}
        >
          <CircleX className="size-8 md:size-10 text-[var(--primary)] " />
        </div>

        <div className="flex items-center px-1 pt-1.5 border-t border-t-[var(--primary)]/20">
          <div className="flex items-center justify-center flex-col gap-4 aspect-square bg-[var(--primary)] px-2 h-52 rounded-2xl relative text-white">
            <span className="absolute top-4 right-4 cursor-pointer p-0.5 border-[2px] border-white rounded-full">
              <EditIcon className="stroke-white stroke-2" />
            </span>

            <Image
              src={"https://avatar.iran.liara.run/public/46"}
              alt="Profile Image"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <p className="">User</p>
            <div className="w-full flex items-center justify-between">
              <p>0.1 SST Pool</p>
              <p>Point: -</p>
            </div>
            <p>Rank: -</p>
          </div>
          <div className="grid gap-6 p-8 grid-cols-2 items-center text-[var(--primary)]">
            <div className="flex flex-col items-center cursor-pointer">
              <WalletIcon className="w-10" />
              <p className="text-sm">Wallet</p>
            </div>
            <Link
              href={"/betting-slips"}
              className="flex flex-col items-center"
            >
              <TicketIcon className="w-10" />
              <p className="text-sm text-nowrap">Bet Slip</p>
            </Link>
            <Link href={"/create-slip"} className="flex flex-col items-center">
              <PlayIcon className="w-10" />
              <p className="text-sm text-nowrap">Bet Slip</p>
            </Link>
            <Link
              href={"/transaction-history"}
              className="flex flex-col items-center"
            >
              <HistoryIcon className="w-10" />
              <p className="text-sm text-nowrap">Bet Slip</p>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full items-center justify-center border-t border-t-[var(--primary)]/20">
          {navLinks.map((item, i) => (
            <React.Fragment key={i}>
              {item.href && (
                <Link
                  href={item.href}
                  className="font-medium text-black hover:text-[var(--primary)] transition-all duration-300 ease-in-out text-lg"
                >
                  {item.label}
                </Link>
              )}
              {item.label == "Login" && (
                <button
                  onClick={openModal}
                  className="border border-[var(--primary)] px-4 py-1 text-lg font-medium rounded-md hover:text-[var(--primary)] transition-colors duration-300"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sports.map((sport, idx) => (
            <Image key={idx} src={sport} alt={`sport`} className="w-10" />
          ))}
        </div>
        <div className=" w-full flex items-center justify-around absolute bottom-1">
          <XICon className="" />
          <LinkedinIcon />
          <InstagramIcon />
          <FacebookIcon />
        </div>
      </div>
    </nav>
  );
}

const navLinks = [
  { label: "Sports", href: "/sports" },
  { label: "Live Matches", href: "/live-matches" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Player Support", href: "/player-support" },
  { label: "Contact", href: "/contact" },
  { label: "Language", href: "/language" },
  { label: "Create Slip", href: "/create-slip" },
  { label: "Login" },
];
const sports = [
  football,
  basketball,
  hockey,
  tennis,
  target,
  volleyball,
  rugby,
  cricket,
];
