import CancelXIcon from "@/assets/svgs/cancel-x";
import GreaterThan from "@/assets/svgs/double-greaterthan";
import LessThan from "@/assets/svgs/double-lessthan";
import { useAuthModal } from "@/context/AuthModalContext";
import { useBettingSlips } from "@/context/useBettingSlips";
import { Plus, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EnterPoolModal({ close }: { close: () => void }) {
  const {
    slips,
    poolId,
    hasEnteredPool,
    hasPoolStarted,
    hasPoolEnded,
    hasWon,
    setHasEnteredPool,
  } = useBettingSlips();

  const { userData } = useAuthModal();

  const [poolOption, setPoolOption] = useState("0.1");

  const increase = () =>
    setPoolOption((prev) => (parseFloat(prev) + 0.1).toFixed(1));

  const decrease = () =>
    setPoolOption((prev) => Math.max(0.1, parseFloat(prev) - 0.1).toFixed(1));

  return (
    <div className="fixed inset-0 items-center justify-center flex z-50">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="bg-white rounded-xl md:rounded-[20px] px-4 sm:px-6 md:px-10 py-10 relative flex flex-col items-center justify-center gap-6 md:gap-10">
        <span
          className="p-1 md:p-2 rounded-full border-2 border-[var(--primary)] absolute top-2 right-2 cursor-pointer"
          onClick={close}
        >
          <CancelXIcon className="size-3 md:size-4 stroke-[var(--primary)]" />
        </span>
        <div className="flex w-full flex-col gap-4 md:gap-6">
          <div className="flex items-center justify-center gap-4 p-1 px-4 border border-red-400 rounded-full">
            <TriangleAlert color="red" className="size-4 md:size-6" />
            <p className="text-sm md:text-xl font-medium sm:font-semibold">
              Once you select pool you cannot edit slip.
            </p>
          </div>
          <div className="flex justify-between items-center gap-4">
            <p className="text-sm sm:text-xl md:text-2xl font-medium">
              Enter Pool
            </p>
            <div className="rounded-[10px] gap-3 md:gap-5 px-3 md:px-6 py-2 md:py-4 bg-[var(--primary-light)] flex items-center justify-center">
              <span className="cursor-pointer" onClick={decrease}>
                <LessThan className="size-4 md:size-6" />
              </span>
              <p className="text-sm sm:text-xl md:text-2xl">{poolOption} SST</p>
              <span className="cursor-pointer" onClick={increase}>
                <GreaterThan className="size-4 md:size-6" />
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <p className="text-sm sm:text-xl md:text-2xl font-medium">
              Wallet balance
            </p>
            <p className="text-sm sm:text-xl md:text-2xl">
              {userData.balance} STT
            </p>
          </div>
        </div>

        {(userData.balance < poolOption ||
          hasEnteredPool ||
          hasPoolStarted) && (
          <p className="w-full text-center font-medium text-sm text-red-500">
            {userData.balance < poolOption
              ? "Insufficient balance to enter the pool. Please fund your wallet."
              : hasEnteredPool
              ? "You have already entered the pool."
              : hasPoolStarted
              ? " The pool has already started, you cannot enter now."
              : ""}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <p className="text-[var(--primary)] text-sm sm:text-xl md:text-2xl font-medium flex gap-2 items-center cursor-pointer">
            Fund Wallet
            <span>
              <Plus className="size-4 md:size-6 stroke-[var(--primary)] stroke-2" />
            </span>
          </p>
          <button
            disabled={
              userData.balance < poolOption || hasEnteredPool || hasPoolStarted
            }
            onClick={() => {
              setHasEnteredPool(true);
              toast.success("You have entered the pool");
              close();
              localStorage.setItem(
                "game",
                JSON.stringify({
                  slips,
                  poolId,
                  hasEnteredPool,
                  hasPoolStarted,
                  hasPoolEnded,
                  hasWon,
                })
              );
            }}
            className="text-sm md:text-lg font-normal bg-[var(--primary)] rounded-lg px-2 md:px-3.5 py-2.5 md:py-4 text-white capitalize hover:bg-[var(--primary)]/80"
          >
            Choose Pool
          </button>
        </div>
      </div>
    </div>
  );
}
