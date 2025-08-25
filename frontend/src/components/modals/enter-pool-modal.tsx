import CancelXIcon from "@/assets/svgs/cancel-x";
import { useAuthModal } from "@/context/AuthModalContext";
import { useBettingSlips } from "@/context/useBettingSlips";
import { usePoolContract } from "@/hooks/usePoolContracts";
import { addBet, updatePoolParticipation } from "@/lib/firebase/firestore";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function EnterPoolModal({ close }: { close: () => void }) {
  const { authenticated, login, user } = usePrivy();
  const { wallets } = useWallets();
  const {
    getPoolBalance,
    enterPool,
    hasUserEnteredPool,
    getPlayerCount,
    debugContractState,
    loading: contractLoading,
    isInitialized,
  } = usePoolContract();

  // const { setIsFundModalOpen } = useSSTInteraction();

  const {
    slips,
    poolId,
    hasEnteredPool,
    hasPoolStarted,
    hasPoolEnded,
    setHasEnteredPool,
  } = useBettingSlips();

  const {
    userData: { balance = "0.00", walletAddress, user_id },
  } = useAuthModal();

  const [poolOption, setPoolOption] = useState("0.1");

  // const increase = () =>
  //   setPoolOption((prev) => (parseFloat(prev) + 0.1).toFixed(2));

  // const decrease = () =>
  //   setPoolOption((prev) => Math.max(0.1, parseFloat(prev) - 0.1).toFixed(2));

  const [loading, setLoading] = useState(false);
  const [poolBalance, setPoolBalance] = useState<string>("0");
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [alreadyEntered, setAlreadyEntered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contractLoading) return;

    (async () => {
      if (authenticated && wallets.length) {
        try {
          const currentBalance = await getPoolBalance();
          setPoolBalance(currentBalance);

          const count = await getPlayerCount();
          setPlayerCount(count);

          const entered = await hasUserEnteredPool();
          setAlreadyEntered(entered);
        } catch (error) {
          console.error("Error fetching pool data:", error);
          setError(error instanceof Error ? error.message : "Unknown error");
        }
      }
    })();
  }, [authenticated, wallets, contractLoading]);

  const handleEnterPool = async () => {
    if (slips.length === 0) {
      toast.error("Please add slips to enter the pool.");
      return;
    }
    if (!authenticated) {
      toast.error("Please connect your wallet to enter the pool.");
      login();
      return;
    }
    if (balance < poolOption) {
      toast.error("Insufficient balance to enter the pool.");
      return;
    }
    if (hasEnteredPool) {
      toast.error("You have already entered the pool.");
      return;
    }
    if (hasPoolStarted) {
      toast.error("The pool has already started, you cannot enter now.");
      return;
    }

    setLoading(true);

    try {
      await debugContractState();

      await enterPool(poolOption);

      const userWalletAddress = walletAddress || user?.wallet?.address;

      if (userWalletAddress) {
        await updatePoolParticipation(userWalletAddress, true);
        await addBet(
          {
            userId: user_id,
            walletAddress,
            odds: slips.reduce((acc, slip) => acc + parseFloat(slip.odds), 0),
            stake: parseFloat(poolOption),
            timestamp: Date.now(),
            status: "pending",
            settled: false,
            slips,
            poolId,
            hasEnteredPool: true,
            hasPoolEnded,
            hasPoolStarted,
          },
          `${user_id.split(":")[2]}-${uuidv4()}`
        );

        console.log(
          `✅ User ${userWalletAddress} marked as pool participant in Firebase`
        );
      } else console.warn("⚠️ Could not get wallet address for Firebase sync");

      setHasEnteredPool(true);
      toast.success("You have entered the pool");
      close();
    } catch (error) {
      console.error("Failed to enter pool:", error);

      const errorMessage =
        error instanceof Error ? error.message : "something went wrong";
      toast.error(
        errorMessage.includes("Pool duration has ended")
          ? "Pool duration has ended, you cannot enter now."
          : errorMessage
      );
      setError(
        errorMessage.includes("Pool duration has ended")
          ? "Pool duration has ended, you cannot enter now."
          : errorMessage
      );
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 items-center justify-center flex z-50">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="bg-white rounded-xl md:rounded-[20px] px-4 sm:px-6 md:px-10 py-10 relative flex flex-col items-center justify-center gap-6 md:gap-10 max-w-3xl">
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
              <p className="text-sm sm:text-xl md:text-2xl">{poolOption} SST</p>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <p className="text-sm sm:text-xl md:text-2xl font-medium">
              Wallet balance
            </p>
            <p className="text-sm sm:text-xl md:text-2xl">{balance} STT</p>
          </div>
          <div className="flex justify-between items-center gap-4">
            <p className="text-sm sm:text-xl md:text-2xl font-medium">
              Current pool balance
            </p>
            <p className="text-sm sm:text-xl md:text-2xl">
              {parseFloat(poolBalance).toFixed(2)} STT
            </p>
          </div>

          <div className="flex justify-between items-center gap-4">
            <p className="text-sm sm:text-xl md:text-2xl font-medium">
              Players in pool
            </p>
            <p className="text-sm sm:text-xl md:text-2xl">{playerCount}</p>
          </div>
        </div>

        {(error ||
          balance < poolOption ||
          alreadyEntered ||
          hasEnteredPool ||
          hasPoolStarted) && (
          <p className="w-full text-center font-medium text-sm text-red-500">
            {error
              ? error
              : balance < poolOption
              ? "You do not have enough balance to enter the pool."
              : alreadyEntered
              ? "You have already entered the pool."
              : hasEnteredPool
              ? "You have already entered the pool."
              : hasPoolStarted
              ? " The pool has already started, you cannot enter now."
              : ""}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          {/* <p
            onClick={() => {
              setIsFundModalOpen(true);
              close();
            }}
            className="text-[var(--primary)] text-sm sm:text-xl md:text-2xl font-medium flex gap-2 items-center cursor-pointer"
          >
            Fund Wallet
            <span>
              <Plus className="size-4 md:size-6 stroke-[var(--primary)] stroke-2" />
            </span>
          </p> */}
          <button
            disabled={
              loading ||
              contractLoading ||
              !isInitialized ||
              balance < poolOption ||
              hasEnteredPool ||
              alreadyEntered ||
              hasPoolStarted
            }
            onClick={handleEnterPool}
            className="flex items-center justify-center text-sm md:text-lg font-normal bg-[var(--primary)] rounded-lg px-2 md:px-3.5 py-2.5 md:py-4 text-white capitalize hover:bg-[var(--primary)]/80 disabled:opacity-50"
          >
            {loading || contractLoading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : !isInitialized ? (
              "Connecting Wallet..."
            ) : hasEnteredPool || alreadyEntered ? (
              "Already Entered"
            ) : hasPoolStarted ? (
              "Pool Started"
            ) : (
              "Enter Pool & Save Slip"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
