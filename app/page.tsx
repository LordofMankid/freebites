"use client";
// import { Assets } from "pixi.js";
import Navbar from "./components/Navbar";
import TopHero from "./components/TopHero";
import BottomHero from "./components/BottomHero";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  createScope,
  createSpring,
  createTimeline,
  onScroll,
  Scope,
} from "animejs";
import FullScreenSection from "./components/common/FullScreenSection";
import PopupTag from "./components/common/PopupTag";
import HomeBackground from "./components/HomeBackground";
import AnimatedPhone, {
  PhoneState,
  TransitionType,
} from "./components/AnimatedPhone";
import { Application } from "@pixi/react";

// await Assets.init();
export default function Home() {
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);

  // this looks kinda ugly but it works -- refactor later?
  const topHeroRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const bottomHeroRef = useRef<HTMLDivElement>(null);
  const popupTagRef = useRef<HTMLDivElement>(null);
  const popupWrapperRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasRef2 = useRef<HTMLDivElement>(null);

  const landingBgRef = useRef<HTMLDivElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const [phoneState, setPhoneState] = useState<PhoneState>(PhoneState.SCREEN1);
  const [transitionType, setTransitionType] = useState<TransitionType>(
    TransitionType.SLIDE_LEFT
  );

  const handleNextScreen = useCallback(() => {
    setTransitionType(TransitionType.SLIDE_LEFT);
    setPhoneState(
      phoneState === PhoneState.SCREEN1
        ? PhoneState.SCREEN2
        : PhoneState.SCREEN2
    );
  }, [phoneState]);

  // const demoInteractable = useMemo(() => {
  //   if (canvasRef.current) {
  //     return parseFloat(window.getComputedStyle(canvasRef.current).opacity) > 0;
  //   }
  // }, []);

  // ANIMATION USEEFFECT
  useEffect(() => {
    const targets = [
      block1Ref.current,
      block2Ref.current,
      block3Ref.current,
      bottomHeroRef.current,
    ].filter(Boolean); // Filter out null refs

    scope.current = createScope({ root }).add((self) => {
      if (
        topHeroRef.current &&
        popupTagRef.current &&
        popupWrapperRef.current
      ) {
        const landingTimeline = createTimeline({ autoplay: true });

        // topHero animation
        landingTimeline.set(topHeroRef.current, { scale: 0 }).add(
          topHeroRef.current,
          {
            scale: {
              from: 0,
              to: 1,
              ease: createSpring({
                damping: 5,
                stiffness: 120,
                velocity: 2,
                mass: 0.125,
              }),
              duration: 1000,
            },
          },
          500
        );
        // animating the popup
        landingTimeline.set(popupTagRef.current, { translateY: 150 }, 0).add(
          popupTagRef.current,
          {
            translateY: {
              from: 100,
              to: 0,
              ease: createSpring({
                damping: 4.25,
                stiffness: 150,
                velocity: 2,
                mass: 0.125,
              }),
              duration: 1000,
              delay: 150,
            },
          },
          600
        );

        // animate on scroll
        animate(topHeroRef.current, {
          opacity: { from: 1, to: 0, duration: 350, ease: "in(3)" },
          autoplay: onScroll({
            target: topHeroRef.current,
            container: ".page",
            enter: "top+=10% top",
            leave: "top+=10% bottom-=20%",
            repeat: true,
            sync: 1,
            // debug: true,
          }),
        });

        animate(popupWrapperRef.current, {
          opacity: { from: 1, to: 0, duration: 350, ease: "in(3)" },
          translateY: {
            from: 0,
            to: 150,
            ease: "linear",
            duration: 1000,
          },
          autoplay: onScroll({
            target: topHeroRef.current,
            container: ".page",
            enter: "top+=10% top",
            leave: "top+=10% bottom+=20%",
            repeat: true,
            sync: 0.1,
            // debug: true,
          }),
        });
      }

      if (canvasRef.current && canvasRef2.current && textSectionRef.current) {
        createTimeline({
          autoplay: onScroll({
            target: textSectionRef.current,
            container: ".page",
            enter: "bottom-=20% top+=15%",
            leave: "bottom-=20% max",
            sync: 1,
            // debug: true,
          }),
        })
          .add(canvasRef.current, {
            opacity: { from: 0, to: 1, duration: 500, ease: "linear" },
            translateY: {
              from: 50,
              to: 0,
              ease: "inOut",
              duration: 600,
            },
          })
          .add(
            canvasRef.current,
            {
              translateX: {
                from: 0,
                to: window.innerWidth * 0.2,
                ease: "inOut",
                duration: 500,
              },
            },
            1400
          )
          // .call(handleNextScreen, 3500) // might need sep timeline/callers for the state changes
          .add(
            canvasRef.current,
            {
              opacity: { from: 1, to: 0, duration: 250, ease: "linear" },
              translateY: {
                from: 0,
                to: 50,
                ease: "linear",
                duration: 250,
              },
            },
            5500
          );
      }

      // initial animation of fadeout for landing page
      if (landingBgRef.current) {
        animate(landingBgRef.current, {
          opacity: { from: 1, to: 0, duration: 1000, ease: "in(4)" },
          // maxHeight: { from: "100vh", to: "50vh", ease: "in(4)" },
          autoplay: onScroll({
            // target: landingBgRef.current,
            container: ".page",
            enter: "center bottom-=20%",
            leave: "center bottom+=75%",
            sync: 0.25,
          }),
        });
      }

      // animate on scroll
      targets.forEach((target) => {
        if (!target) return;
        animate(target, {
          opacity: { from: 0, to: 1, duration: 350, ease: "out(3)" },
          translateY: {
            from: 50,
            to: 0,
            ease: createSpring({
              damping: 4.25,
              stiffness: 150,
              velocity: 2,
              mass: 0.125,
            }),
            duration: 1000,
            delay: 150,
          },
          autoplay: onScroll({
            target: target,
            container: ".page",
            enter: "bottom-=10% top",
            leave: "min bottom",
            repeat: true,
            sync: 0.25,
            // debug: true,
          }),
        });
      });

      self.add("jumpToDemo", () => {
        if (!block1Ref.current) return;

        const top =
          block1Ref.current.getBoundingClientRect().top + window.scrollY;

        const offset = window.innerHeight * 0.1;
        animate([document.scrollingElement || document.documentElement], {
          scrollTop: top - offset,
          duration: 1000,
          easing: "easeInOutQuad",
        });
      });
    });
  }, [handleNextScreen]);

  const jumpToPhone = useCallback(() => {
    scope.current?.methods.jumpToDemo();
  }, []);

  return (
    <div ref={root} className="relative z-10 page flex flex-col">
      <Navbar />
      <HomeBackground ref={landingBgRef} />
      <div ref={popupWrapperRef} className="fixed bottom-16 mx-40 z-20">
        <PopupTag
          ref={popupTagRef}
          text="Learn more below!"
          onClick={jumpToPhone}
        />
      </div>
      <div className="flex flex-col items-center mx-4 lg:mx-24 md:mx-4 mb-24 pointer-events-none  mt-16 lg:mt-32">
        <div className="flex flex-col w-full justify-start min-h-[90vh]">
          <TopHero ref={topHeroRef} />
        </div>
        <div
          className="flex w-full md:flex-row pointer-events-auto"
          ref={textSectionRef}
        >
          <div className="flex flex-col items-start gap-20 mx-16 md:w-1/2">
            <div className="h-[150vh]"> </div>
            <FullScreenSection
              ref={block1Ref}
              title="Find Free Food"
              body="Feeling hungry? Browse Freebites for free food opportunities on your campus."
              altContainerStyle="opacity-0"
            />

            <FullScreenSection
              ref={block2Ref}
              title="Share Free Food"
              body="Got leftover food from an event you hosted? Post it on Freebites instead of throwing it away."
              altContainerStyle="opacity-0"
            />
            <FullScreenSection
              ref={block3Ref}
              title="Get Notified"
              body="Receive instant push notifications when new food is posted, and check the comments for updates!"
              altContainerStyle="opacity-0"
            />
            <div className="h-[10vh]"> </div>
          </div>
        </div>
        <BottomHero ref={bottomHeroRef} altContainerStyle="opacity-0" />
      </div>

      <div
        ref={canvasRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        // style={{ pointerEvents: demoInteractable ? "none" : "auto" }} // Add dynamic pointer-events handling
        style={{ pointerEvents: "none" }}
      >
        <div ref={canvasRef2}>
          <Application backgroundAlpha={0} width={800} height={800}>
            <AnimatedPhone
              currentState={phoneState}
              transitionType={transitionType}
            />
          </Application>
        </div>
      </div>
    </div>
  );
}
