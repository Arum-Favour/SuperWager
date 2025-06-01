"use client";

import { usePrivy } from "@privy-io/react-auth";
import { createContext, useContext, useEffect, useState } from "react";

type ModalContextType = {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  userData: UserType;
  setUserData: React.Dispatch<React.SetStateAction<UserType>>;
  handleLogin: () => Promise<void>;
  handleLogout: () => void;
};

const AuthModalContext = createContext<ModalContextType | undefined>(undefined);

export const AuthModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { login, user, logout } = usePrivy();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const [userData, setUserData] = useState<UserType>({
    user_id: "",
    username: "User",
    email: "",
    embeddedWallet: null,
    balance: "0.00",
    walletAddress: "",
  });

  const handleLogin = async () => {
    try {
      await login();
      closeLoginModal();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => logout();

  const getDisplayName = () => {
    if (!user) return "User";

    if (user.email?.address) return user.email.address.split("@")[0];

    return user.id?.substring(0, 8) || "User";
  };

  useEffect(() => {
    if (user)
      setUserData({
        ...userData,
        user_id: user.id,
        username: getDisplayName(),
        email: user.email?.address || "",
      });
  }, [user]);

  return (
    <AuthModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        userData,
        setUserData,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within a AuthModalProvider");
  }
  return context;
};
