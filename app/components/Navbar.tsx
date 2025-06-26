import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/freebites.svg";
import CommonButton from "./common/CommonButton";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import {
  animate,
  createDraggable,
  createScope,
  createSpring,
  Scope,
} from "animejs";
const Navbar = () => {
  const [isOpen, setOpen] = useState(false); // open/close the hamburger menu
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    // let bounceAnim: ReturnType<typeof animate> | null = null;
    scope.current = createScope({ root }).add((self) => {
      // Every anime.js instances declared here are now scopped to <div ref={root}>

      // Make the logo draggable around its center
      createDraggable(".logo", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 }),
      });

      // Register function methods to be used outside the useEffect
      self.add("rotateLogo", (open: boolean) => {
        animate(".logo", {
          rotate: open ? 0 : 360,
          ease: "out(4)",
          duration: 1000,
        });
      });

      const bounceAnim = animate(".logo", {
        scale: [
          { to: 1.25, ease: "inOut(3)", duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) },
        ],
        loop: true,
        loopDelay: 250,
        autoplay: false,
      });

      self.add("bounceLogo", () => {
        bounceAnim?.play();
      });

      self.add("stopBounceLogo", () => {
        bounceAnim?.pause();
        bounceAnim?.seek(0); // Reset the animation to start
      });
    });

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current?.revert();
  }, []);

  const handleClick = () => {
    // Animate logo rotation on click using the method declared inside the scope
    scope.current?.methods.rotateLogo(isOpen);
    setOpen(!isOpen);
  };

  return (
    <nav
      ref={root}
      className="flex flex-row h-32 items-center justify-between lg:mx-20 mx-12"
    >
      <Logo className="w-14 h-16" />
      <button
        onClick={() => {
          handleClick();
          // setOpen(!isOpen);
        }}
        className="logo lg:hidden lg:mx-10 mx-4"
        onMouseEnter={() => {
          scope.current?.methods.bounceLogo();
        }}
        onMouseLeave={() => {
          scope.current?.methods.stopBounceLogo();
        }}
      >
        <IoMenu size={24} />
      </button>
      <div
        className={`lg:flex flex-row h-11 font-inter items-center gap-12 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <Link href="/mission">Mission</Link>
        <Link href="/team">Team</Link>
        <Link href="/contact">Contact</Link>
        <div className="flex flex-row h-11 items-center gap-4">
          <CommonButton label={"sign up"} />
          <CommonButton label={"consult with freebites"} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
