import { AuthModalProvider } from "@/context/AuthModalContext";
import { BettingSlipsProvider } from "@/context/useBettingSlips";
import { MatchesProvider } from "@/context/useMatchesContext";
import { PrivyProvider } from "@/providers/PrivyProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider>
      <QueryProvider>
        <AuthModalProvider>
          <MatchesProvider>
            <BettingSlipsProvider>
              <Toaster position="top-right" richColors />
              {children}
            </BettingSlipsProvider>
          </MatchesProvider>
        </AuthModalProvider>
      </QueryProvider>
    </PrivyProvider>
  );
}
