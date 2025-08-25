import { useState } from "react";

export default function useSSTInteraction() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);

  return {
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    isFundModalOpen,
    setIsFundModalOpen,
  };
}
