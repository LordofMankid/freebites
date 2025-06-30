"use client";

import Navbar from "./components/Navbar";
import TopHero from "./components/TopHero";
import BottomHero from "./components/BottomHero";
import ImageTextBlock from "./components/ImageTextBlock";
import tempImg from "./assets/tempImg.png";
import { useEffect, useRef } from "react";
import { animate, createScope, onScroll, Scope } from "animejs";

export default function Home() {
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);

  // this looks kinda ugly but it works -- refactor later?

  const topHeroRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const bottomHeroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = [
      topHeroRef.current,
      block1Ref.current,
      block2Ref.current,
      block3Ref.current,
      bottomHeroRef.current,
    ].filter(Boolean); // Filter out null refs

    scope.current = createScope({ root }).add(() => {
      targets.forEach((target) => {
        if (!target) return;
        animate(target, {
          opacity: [0, 1],
          duration: 750,
          ease: "in(4)",
          autoplay: onScroll({
            target: target,
            container: ".page",
            enter: "bottom-=30% top",
            leave: "top+=40% bottom",
            sync: "play",
          }),
        });
      });
    });
  }, []);

  return (
    <div ref={root} className="page flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center mx-4 lg:mx-24 md:mx-4 gap-20 mb-24">
        <TopHero ref={topHeroRef} altContainerStyle="opacity-0" />
        <div className="w-full">
          <div className="flex flex-col items-center gap-20 mx-16">
            <ImageTextBlock
              ref={block1Ref}
              src={tempImg}
              alt="temp"
              title="Find Free Food"
              body="Feeling hungry? Browse Freebites for free food opportunities on your campus."
              altContainerStyle="opacity-0"
              imgFirst={false}
            />

            <ImageTextBlock
              ref={block2Ref}
              src={tempImg}
              alt="temp"
              title="Share Free Food"
              body="Got leftover food from an event you hosted? Post it on Freebites instead of throwing it away."
              altContainerStyle="opacity-0"
              imgFirst={true}
            />
            <ImageTextBlock
              ref={block3Ref}
              src={tempImg}
              alt="temp"
              title="Get Notified"
              body="Receive instant push notifications when new food is posted, and check the comments for updates!"
              altContainerStyle="opacity-0"
              imgFirst={false}
            />
          </div>
        </div>
        <BottomHero ref={bottomHeroRef} altContainerStyle="opacity-0" />
      </div>
    </div>
  );
}
