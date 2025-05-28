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
            // { label: "Sports", href: "/sports" },
            // { label: "Leaderboard", href: "/leaderboard" },
            // { label: "Player Support", href: "/player-support" },
            // { label: "Contact", href: "/contact" },
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

// <span
//   className="xl:hidden cursor-pointer"
//   onClick={() => setShowNav((prev) => !prev)}
// >
//   <Menu className="size-8 md:size-12 text-[var(--primary)]" />
// </span>

// <div
//   className={`${
//     showNav ? "translate-x-0" : "translate-x-[100%]"
//   } xl:hidden transition-transform duration-500 transform fixed inset-0 z-40 flex flex-col gap-4 items-center w-full bg-white`}
// >
//   <span
//     className="cursor-pointer self-end pr-[5%] pt-4"
//     onClick={() => setShowNav((prev) => !prev)}
//   >
//     <CircleX className="size-8 md:size-10 text-[var(--primary)]" />
//   </span>
//   <nav className="flex flex-col w-full items-center justify-center border-t border-t-[var(--primary)]/20">
//     {[
//       { label: "Sports", href: "/sports" },
//       { label: "Leaderboard", href: "/leaderboard" },
//       { label: "Player Support", href: "/player-support" },
//       { label: "Contact", href: "/contact" },
//       { label: "Bet Slip", href: "/betting-slips" },
//       { label: "Bet History", href: "/bet-history" },
//       { label: "Create Slip", href: "/create-slip" },
//     ].map((item, i) => (
//       <Link
//         href={item.href}
//         key={i}
//         className="font-medium text-base cursor-pointer text-black hover:text-[var(--primary)]"
//       >
//         {item.label}
//       </Link>
//     ))}
//   </nav>
//   {!user && (
//     <div className="flex xl:hidden flex-col items-center gap-4">
//       <button
//         onClick={openModal}
//         className="bg-transparent rounded-[4px] border text-[var(--primary)] border-[var(--primary)] p-2.5 px-4 font-medium cursor-pointer text-sm transition-all"
//       >
//         Login
//       </button>
//     </div>
//   )}
// </div>
