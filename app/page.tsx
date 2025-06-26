"use client";

import Navbar from "./components/Navbar";
import TopHero from "./components/TopHero";
import BottomHero from "./components/BottomHero";
import ImageTextBlock from "./components/ImageTextBlock";
import tempImg from "./assets/tempImg.png";
export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center mx-24 gap-20 mb-24">
        <TopHero />
        <div className="w-full">
          <div className="flex flex-col items-center gap-20 mx-16">
            <ImageTextBlock
              src={tempImg}
              alt="temp"
              title="Find Free Food"
              body="Feeling hungry? Browse Freebites for free food opportunities on your campus."
              imgFirst={false}
            />

            <ImageTextBlock
              src={tempImg}
              alt="temp"
              title="Share Free Food"
              body="Got leftover food from an event you hosted? Post it on Freebites instead of throwing it away."
              imgFirst={true}
            />
            <ImageTextBlock
              src={tempImg}
              alt="temp"
              title="Get Notified"
              body="Receive instant push notifications when new food is posted, and check the comments for updates!"
              imgFirst={false}
            />
          </div>
        </div>
        <BottomHero />
      </div>
    </div>
  );
}
