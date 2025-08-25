"use client";

import pfp from "@/assets/images/default.webp";
import EditIcon from "@/assets/svgs/edit-icon";
import HistoryIcon from "@/assets/svgs/history-icon";
import PlayIcon from "@/assets/svgs/play-button";
import TicketIcon from "@/assets/svgs/ticket-icon";
import WalletIcon from "@/assets/svgs/wallet-icon";
import { useAuthModal } from "@/context/AuthModalContext";
import { Eye, LucideEyeOff, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function UserCard() {
  const [showWallet, setShowWallet] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const { userData } = useAuthModal();

  if (!userData.user_id) return null;

  return (
    <>
      {showWallet && (
        <div className="fixed -inset-[100%] items-center justify-center flex z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowWallet(false)}
          />
          <div className="bg-white rounded-[20px] p-10 relative flex flex-col items-center justify-center gap-10">
            <div className="flex w-full justify-between items-center gap-10">
              <div className="">
                <p className="text-sm text-black/50">Wallet balance</p>
                <p className="text-3xl">{showBalance ? "5 SST" : "****"}</p>
              </div>
              <span
                onClick={() => setShowBalance((prev) => !prev)}
                className="cursor-pointer"
              >
                {!showBalance ? (
                  <LucideEyeOff className="size-6 stroke-[var(--primary)]" />
                ) : (
                  <Eye className="size-6 stroke-[var(--primary)]" />
                )}
              </span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <p className="text-[var(--primary)] text-xl flex gap-2 items-center cursor-pointer">
                Fund Wallet
                <span>
                  <Plus className="stroke-[var(--primary)] stroke-2" />
                </span>
              </p>
              <button className="text-lg font-normal bg-[var(--primary)] rounded-lg px-3.5 py-2.5 text-white capitalize hover:bg-[var(--primary)]/80">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col items-center justify-center space-y-4">
        <div className="w-full flex items-center justify-center flex-col gap-4 aspect-square bg-[var(--primary)] p-12 rounded-2xl relative text-white">
          <span className="absolute top-4 right-4 cursor-pointer p-0.5 border-[2px] border-white rounded-full">
            <EditIcon className="stroke-white stroke-2" />
          </span>

          <div className="size-[100px] flex items-center justify-center bg-white rounded-full overflow-hidden">
            <Image src={pfp} alt="Profile Image" />
          </div>
          <p className="">{userData.username}</p>
          <div className="w-full flex items-center justify-between">
            <p>0.1 SST Pool</p>
            <p>Point: -</p>
          </div>
          <p>Rank: -</p>
        </div>
        <div className="grid gap-x-16 gap-y-8 p-8 grid-cols-2 items-center text-[var(--primary)]">
          <div
            className="flex flex-col gap-4 items-center cursor-pointer"
            onClick={() => setShowWallet(true)}
          >
            <WalletIcon />
            <p>Wallet</p>
          </div>
          <Link
            href={"/betting-slips"}
            className="flex flex-col gap-4 items-center"
          >
            <TicketIcon />
            <p>Bet Slip</p>
          </Link>
          <Link
            href={"/create-slip"}
            className="flex flex-col gap-4 items-center"
          >
            <PlayIcon className="fill-[var(--primary)]" />
            <p>Create Slip</p>
          </Link>
          <Link
            href={"/transaction-history"}
            className="flex flex-col gap-4 items-center"
          >
            <HistoryIcon />
            <p className="w-full text-center">Transaction History</p>
          </Link>
        </div>
      </div>
    </>
  );
}
