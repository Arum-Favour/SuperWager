import Link from "next/link";
import UserProfile from "./user-profile";

export default function Navbar() {
  return (
    <header className="w-full max-w-screen-2xl mx-auto px-[5%] flex items-center justify-center">
      <div className="py-4 w-full flex items-center justify-between gap-4 max-w-screen-2xl">
        <div className="flex-shrink-0">
          <Link href={"/"}>
            <h1 className="text-sm sm:text-xl font-bold text-[var(--primary)] inknut-antiqua">
              Superwager
            </h1>
          </Link>
        </div>
        <nav className="hidden lg:flex gap-6 items-center justify-center">
          {[
            { label: "Leaderboard", href: "/leaderboard" },
            { label: "Create Slip", href: "/create-slip" },
            { label: "Bet Slip", href: "/betting-slips" },
            { label: "Bet History", href: "/bet-history" },
          ].map((item, i) => (
            <Link
              href={item.href}
              key={i}
              className="font-medium text-base cursor-pointer text-black hover:text-[var(--primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <UserProfile />
      </div>
    </header>
  );
}
