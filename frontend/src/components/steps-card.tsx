"use client";

import bg from "@/assets/images/background.webp";
import mascot from "@/assets/images/mascot.webp";
import Image from "next/image";
import { useEffect, useState } from "react";

const steps = [
  {
    title: "Connect Wallet",
    description: "Sign up using Privy and get your in-app wallet",
  },
  {
    title: "Place Bet",
    description: "Select games and add them to your bet slip",
  },
  {
    title: "Track Progress",
    description: "Watch the leaderboard update as games are settled",
  },
  {
    title: "Collect Rewards",
    description: "Winners receive rewards directly in their wallet",
  },
];

export default function StepsCard() {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const currentStep = steps[activeStep];

  useEffect(() => {
    const interval = setInterval(nextStep, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [activeStep]);

  return (
    <div className="relative w-full flex items-center h-32 min-[480px]:h-40 md:h-48 lg:h-[300px] pl-4 lg:pl-8 py-4 lg:py-16">
      <Image
        src={bg}
        alt="background"
        className="absolute w-[90%] h-32 min-[480px]:h-40 md:h-48 lg:h-[280px] left-0 z-0"
      />
      <Image
        src={mascot}
        alt="mascot"
        className="absolute hidden min-[480px]:block w-[230px] md:w-[65%] h-[150%] right-0 z-10"
      />

      <div className="flex relative w-1/2 min-[480px]:w-2/5 flex-col gap-4 lg:gap-8 h-full justify-between text-white">
        <div className="flex flex-col gap-3 lg:gap-6">
          <p className="text-sm sm:text-base md:text-xl lg:text-[26px]/6">
            {activeStep + 1}. {currentStep.title}
          </p>
          <p className="text-xs sm:text-base md:text-xl lg:text-[26px]/6">
            {currentStep.description}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 [&>*]:cursor-pointer">
          {steps.map((_, i) => (
            <span
              key={i}
              onClick={() => setActiveStep(i)}
              className={`h-0.5 md:h-1 w-4 md:w-10 bg-${
                activeStep === i ? "[var(--primary)]" : "white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
