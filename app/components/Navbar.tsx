"use client";

import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/freebites.svg";
import LogoClosed from "../assets/closed.svg";

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
  const [isOpen, setOpen] = useState<boolean>(false); // open/close the hamburger menu
  const [eyesOpen, setEyesOpen] = useState<boolean>(true);
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);
  // Blinking
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const blink = () => {
      setEyesOpen(false);
      setTimeout(() => {
        setEyesOpen(true);
      }, 250);

      blinkTimeout = setTimeout(blink, Math.random() * 5000 + 1000);
    };

    blinkTimeout = setTimeout(blink, Math.random() * 5000 + 1000);

    return () => clearTimeout(blinkTimeout);
  }, []);

  const lilBiteMouseEnter = () => {
    animate("#lilBite", {
      translateX: [
        { to: 6, ease: createSpring({ stiffness: 500 }), duration: 150 },
      ],
      scale: [{ to: 1.05, ease: "inOut(3)", duration: 100 }],
      rotate: [
        { to: "10deg", ease: createSpring({ stiffness: 400 }), duration: 150 },
      ],
    });
  };
  const lilBiteMouseExit = (clicked: boolean) => {
    animate("#lilBite", {
      translateX: [
        {
          to: 0,
          ease: createSpring({ stiffness: 500, damping: 10 }),
          duration: 100,
        },
      ],
      scale: clicked
        ? [
            { to: 1.2, ease: "inOut(3)", duration: 100 },
            { to: 1, ease: "in", duration: 100 },
          ]
        : [{ to: 1, ease: "in", duration: 100 }],
      rotate: [
        {
          to: "0deg",
          ease: createSpring({ stiffness: 500, damping: 10 }),
          duration: 100,
        },
      ],
    });
  };

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      // animate navbar intro
      animate(".navbar-container", {
        opacity: [0, 1],
        duration: 350,
        ease: "in(4)",
        autoplay: true,
      });
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

      // MOBILE MENU ANIMATION - Updated for Apple-style behavior
      const t1 = createTimeline({ autoplay: false })
        .add(".mobile-menu-overlay", {
          opacity: [0, 1],
          duration: 300,
          ease: "out(3)",
        })
        .add(
          ".mobile-menu-content",
          {
            translateY: ["-100%", "0%"],
            duration: 400,
            ease: "out(4)",
          },
          0,
        ) // Start at the same time as opacity
        .add(
          ".menu-item",
          {
            opacity: [0, 1],
            translateY: [20, 0],
            delay: stagger(80),
            duration: 300,
            ease: "out(3)",
          },
          200,
        );

      self.add("toggleMenu", (open: boolean) => {
        const menuOverlay = document.querySelector(
          ".mobile-menu-overlay",
        ) as HTMLElement;
        if (!menuOverlay) return;

        if (open) {
          menuOverlay.style.display = "flex";
          menuOverlay.style.pointerEvents = "auto";
          t1.play();
        } else {
          menuOverlay.style.pointerEvents = "none";
          t1.reverse();
          // Hide the overlay after reverse animation completes
          setTimeout(() => {
            menuOverlay.style.display = "none";
          }, 400);
        }
      });

      // menu hover animations
      let hoverListenersAttached = false;

      self.add("onHover", () => {
        if (hoverListenersAttached) return; // already attached
        hoverListenersAttached = true;

        const menuItems = document.querySelectorAll(".menu-item");

        menuItems.forEach((item) => {
          item.addEventListener("mouseenter", () => {
            animate(item, {
              scale: [
                { to: 1.05, ease: "inOut(3)", duration: 200 },
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

  // // prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "";
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

  // menu morphism + appear/disappear
  const [hideNav, setHideNav] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return;

      const currentScrollY = window.scrollY;
      setAtTop(currentScrollY === 0);
      setHideNav(currentScrollY > lastScrollY.current && currentScrollY > 32);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <div ref={root} className="z-30">
      <div className="navbar-container opacity-0 pointer-events-auto">
        <nav
          className="flex flex-row fixed w-full
                     lg:z-0 h-16 lg:h-32 px-5 lg:px-10 py-15 lg:py-0
                     items-center justify-between z-50"
        >
          <div
            className={`flex flex-row items-center justify-between w-full
                        transition-all duration-400
                        ${hideNav ? "-translate-y-[200%]" : "translate-y-0"}
                        ${atTop ? "bg-transparent backdrop-blur-0" : "bg-[#d4d4d4]/15 backdrop-blur-sm"}
                        px-10 lg:px-10 rounded-[208] lg:py-0`}
          >
            <Link href="/" className="flex flex-row items-center gap-6">
              <div
                id="lilBite"
                onMouseEnter={lilBiteMouseEnter}
                onMouseLeave={() => lilBiteMouseExit(false)}
                onClick={() => lilBiteMouseExit(true)}
              >
                {eyesOpen ? (
                  <Logo className="w-7 h-16 " />
                ) : (
                  <LogoClosed className="w-7 h-16" />
                )}
              </div>
              <p className="hidden lg:block text-2xl font-inter">Freebites</p>
            </Link>
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
              <Link className="text-[#211f1f]" href="/team">
                Team
              </Link>
              <Link
                className="flex flex-col lg:flex-row lg:h-11 lg:items-center"
                href={"/contact"}
              >
                <CommonButton
                  label={"Contact"}
                  altStyle="border-[#211f1f]"
                  altTextStyle="text-[#211f1f]"
                />
              </Link>
            </div>
          </div>
        </nav>

        {/* Apple-style Mobile Menu Overlay */}
        <div
          className={`mobile-menu-overlay lg:hidden fixed inset-0 z-40 ${isOpen ? "active" : ""}`}
          style={{
            display: "none",
            pointerEvents: "none",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="mobile-menu-content flex flex-col justify-center items-center h-full w-full pt-20">
            <div className="flex flex-col items-center gap-8">
              <Link
                href="/team"
                className="menu-item opacity-0 font-inter text-3xl font-semibold text-[#211f1f] py-3"
                onClick={() => {
                  setOpen(false);
                  scope.current?.methods.toggleMenu(false);
                }}
              >
                Team
              </Link>
              <Link
                href="/contact"
                className="menu-item opacity-0 font-inter text-3xl font-semibold text-[#211f1f] py-3"
                onClick={() => {
                  setOpen(false);
                  scope.current?.methods.toggleMenu(false);
                }}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
