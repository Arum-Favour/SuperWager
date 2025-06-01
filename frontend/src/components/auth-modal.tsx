"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

export default function LoginModal() {
  const { handleLogin, isLoginModalOpen, closeLoginModal } = useAuthModal();

  return (
    <Transition appear show={isLoginModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeLoginModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-black"
                >
                  Sign In to SuperWager
                </DialogTitle>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Connect to place bets, track your performance, and compete
                    on the leaderboard.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleLogin}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-medium bg-[var(--primary)] text-white"
                  >
                    Connect with Privy
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
