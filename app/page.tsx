"use client";

import Navbar from "./components/Navbar";
import TopHero from "./components/TopHero";
import BottomHero from "./components/BottomHero";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center mx-24 gap-20 mb-24">
        <TopHero />
        <BottomHero />
      </div>
    </div>
  );
}
