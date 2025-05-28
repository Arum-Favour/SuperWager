import basketball from "@/assets/images/basketball.png";
import cricket from "@/assets/images/cricket.png";
import football from "@/assets/images/football.png";
import hockey from "@/assets/images/ice-hockey.png";
import rugby from "@/assets/images/rugby.png";
import target from "@/assets/images/target.png";
import tennis from "@/assets/images/tennis.png";
import volleyball from "@/assets/images/volleyball.png";
import FacebookIcon from "@/assets/svgs/facebook";
import FrameIcon from "@/assets/svgs/frame";
import GlobeIcon from "@/assets/svgs/globe";
import InstagramIcon from "@/assets/svgs/instagram";
import LinkedinIcon from "@/assets/svgs/linkedin";
import PeopleIcon from "@/assets/svgs/people";
import ScrewIcon from "@/assets/svgs/screw";
import XICon from "@/assets/svgs/twitter";
import Image from "next/image";
import UserCard from "./user-card";

export default function Aside() {
  return (
    <aside className="hidden lg:flex min-h-screen flex-col space-y-16 justify-between">
      <UserCard />
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
