import Aside from "@/components/aside";
import AuthModalWrapper from "@/components/AuthModalWrapper";
import Navbar from "@/components/navbar";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { BettingSlipsProvider } from "@/context/useBettingSlips";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthModalProvider>
      <BettingSlipsProvider>
        <Toaster position="top-right" richColors />
        <main className="relative">
          <Navbar />
          <div className="w-full min-h-screen p-[5%] flex gap-20 justify-between max-w-screen-3xl mx-auto">
            <div className="flex-[75%]">{children}</div>
            <Aside />
          </div>
          <AuthModalWrapper />
        </main>
      </BettingSlipsProvider>
    </AuthModalProvider>
  );
}
