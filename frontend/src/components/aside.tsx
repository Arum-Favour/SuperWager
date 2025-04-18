import basketball from "@/assets/images/basketball.png";
import cricket from "@/assets/images/cricket.png";
import football from "@/assets/images/football.png";
import hockey from "@/assets/images/ice-hockey.png";
import rugby from "@/assets/images/rugby.png";
import target from "@/assets/images/target.png";
import tennis from "@/assets/images/tennis.png";
import volleyball from "@/assets/images/volleyball.png";
import EditIcon from "@/assets/svgs/edit-icon";
import FacebookIcon from "@/assets/svgs/facebook";
import FrameIcon from "@/assets/svgs/frame";
import GlobeIcon from "@/assets/svgs/globe";
import HistoryIcon from "@/assets/svgs/history-icon";
import InstagramIcon from "@/assets/svgs/instagram";
import LinkedinIcon from "@/assets/svgs/linkedin";
import PeopleIcon from "@/assets/svgs/people";
import PlayIcon from "@/assets/svgs/play-button";
import ScrewIcon from "@/assets/svgs/screw";
import TicketIcon from "@/assets/svgs/ticket-icon";
import XICon from "@/assets/svgs/twitter";
import WalletIcon from "@/assets/svgs/wallet-icon";
import Image from "next/image";
import Link from "next/link";
import pfp from "@/assets/images/default.png";

export default function Aside() {
  return (
    <aside className="min-h-screen lg:flex flex-col space-y-16 justify-between hidden">
      <div className="w-full flex flex-col items-center justify-center space-y-4">
        <div className="w-full flex items-center justify-center flex-col gap-4 aspect-square bg-[var(--primary)] p-12 rounded-2xl relative text-white">
          <span className="absolute top-4 right-4 cursor-pointer p-0.5 border-[2px] border-white rounded-full">
            <EditIcon className="stroke-white stroke-2" />
          </span>

          <div className="size-[100px] flex items-center justify-center bg-white rounded-full overflow-hidden">
            <Image src={pfp} alt="Profile Image" />
          </div>
          <p className="">User</p>
          <div className="w-full flex items-center justify-between">
            <p>0.1 SST Pool</p>
            <p>Point: -</p>
          </div>
          <p>Rank: -</p>
        </div>
        <div className="grid gap-x-16 gap-y-8 p-8 grid-cols-2 items-center text-[var(--primary)]">
          <div className="flex flex-col gap-4 items-center cursor-pointer">
            <WalletIcon />
            <p>Wallet</p>
          </div>
          <Link
            href={"/betting-slips"}
            className="flex flex-col gap-4 items-center"
          >
            <TicketIcon />
            <p>Bet Slip</p>
          </Link>
          <Link
            href={"/create-slip"}
            className="flex flex-col gap-4 items-center"
          >
            <PlayIcon />
            <p>Bet Slip</p>
          </Link>
          <Link
            href={"/transaction-history"}
            className="flex flex-col gap-4 items-center"
          >
            <HistoryIcon />
            <p>Bet Slip</p>
          </Link>
        </div>
      </div>
      <div className="h-full justify-between items-center flex flex-col gap-8">
        <div className="grid grid-cols-3 items-center gap-10 px-8">
          <Image src={football} alt="Image of a football" />
          <Image src={basketball} alt="Image of a basketball" />
          <Image src={hockey} alt="Image of a hockey" />
          <Image src={tennis} alt="Image of a tennis" />
          <Image src={target} alt="Image of a target" />
          <Image src={volleyball} alt="Image of a volleyball" />
          <Image src={rugby} alt="Image of a rugby" />
          <Image src={rugby} alt="Image of a rugby" />
          <Image src={cricket} alt="Image of a cricket" />
        </div>
        <div className="bg-[var(--primary-light)] rounded-[2.25rem] p-9 mt-auto w-full grid grid-cols-4 gap-10">
          <PeopleIcon />
          <FrameIcon />
          <GlobeIcon />
          <ScrewIcon />
          <XICon />
          <LinkedinIcon />
          <InstagramIcon />
          <FacebookIcon />
        </div>
      </div>
    </aside>
  );
}
