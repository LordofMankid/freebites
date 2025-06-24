import React from "react";
import Logo from "../assets/freebites.svg";
import CommonButton from "./common/CommonButton";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex flex-row h-32 items-center justify-between mx-20">
      <Logo className="w-14 h-16" />
      <div className="flex flex-row h-11 items-center gap-12">
        <Link href="/mission">Mission</Link>
        <Link href="/team">Team</Link>
        <Link href="/contact">Contact</Link>
        <div className="flex flex-row h-11 items-center gap-4">
          <CommonButton label={"sign up"} />
          <CommonButton label={"consult with freebites"} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
