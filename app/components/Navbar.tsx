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
  createTimeline,
  Scope,
  stagger,
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
          rotate: open ? 360 : 0,
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

      // MENU ANIMATION

      const t1 = createTimeline({ autoplay: false })
        .add(".menu", {
          height: ["0vh", "100vh"],
          ease: "out(4)",
        })
        .add(
          ".menu-item",
          {
            opacity: [0, 1],
            delay: stagger(60),
            duration: 300,
            ease: "out(3)",
          },
          200
        );

      self.add("toggleMenu", (open: boolean) => {
        if (open) t1.play();
        else t1.seek(400).reverse(); // plays in reverse
      });

      // menu hover animations
      let hoverListenersAttached = false;

      self.add("onHover", () => {
        if (hoverListenersAttached) return; // already attached
        hoverListenersAttached = true;

        const menuItems = document.querySelectorAll(".menu-item"); // change the items to select here

        menuItems.forEach((item) => {
          item.addEventListener("mouseenter", () => {
            animate(item, {
              // change the animations here
              scale: [
                { to: 1.1, ease: "inOut(3)", duration: 200 },
                { to: 1, ease: createSpring({ stiffness: 200 }) },
              ],
            });
          });

          item.addEventListener("mouseleave", () => {
            animate(item, {
              scale: [{ to: 1, ease: "inOut(3)", duration: 150 }],
            });
          });
        });
      });
    });

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current?.revert();
  }, []);

  // prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflowY = "scroll"; // so the page doesn't jump when scrollbar hides
      document.body.style.width = "100%";

      // Store scroll position so we can restore later
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = document.body.dataset.scrollY ?? "0";

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflowY = "";
      document.body.style.width = "";

      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY));
    }

    // Cleanup just in case
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflowY = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // add listener to auto close menu when resizing window
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => {
      if (mediaQuery.matches) {
        setOpen(false);
        scope.current?.methods.toggleMenu(false);
      }
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleClick = () => {
    // Animate logo rotation on click using the method declared inside the scope
    setOpen(!isOpen);
    scope.current?.methods.rotateLogo(!isOpen);
    scope.current?.methods.toggleMenu(!isOpen);
    scope.current?.methods.onHover();
  };

  return (
    <div ref={root}>
      <nav className="flex flex-row z:50 lg:z-0 h-16 lg:h-32 items-center justify-between lg:mx-20 mx-10">
        <Logo className="w-14 h-10 lg:h-16" />
        <button
          onClick={() => {
            handleClick();
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
          className={`font-inter items-center lg:flex lg:flex-row lg:h-11 lg:gap-12 hidden`}
        >
          <Link href="/mission">Mission</Link>
          <Link href="/team">Team</Link>
          <Link href="/contact">Contact</Link>
          <div className="flex flex-col lg:flex-row lg:h-11 lg:items-center gap-4">
            <CommonButton label={"sign up"} />
            <CommonButton label={"consult with freebites"} />
          </div>
        </div>
      </nav>

      <div
        className={`menu lg:hidden flex flex-col h-0 z-50 items-start pl-12`}
      >
        <Link href="/mission" className="menu-item opacity-0 font-inter">
          Mission
        </Link>
        <Link href="/team" className="menu-item opacity-0 font-inter">
          Team
        </Link>
        <Link href="/contact" className="menu-item opacity-0 font-inter">
          Contact
        </Link>
        <Link href="/consult" className="menu-item opacity-0 font-inter">
          Consult with Freebites
        </Link>
        <Link href="/signup" className="menu-item opacity-0 font-inter">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
