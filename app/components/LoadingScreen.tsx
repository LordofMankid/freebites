import Image from "next/image";
import React, { useEffect, useState } from "react";
import LogoSpline from "./LogoSpline";
import { animate } from "animejs";

function LoadingScreen() {
  const [close, setClose] = useState<boolean>(false);

  useEffect(() => {
    if (!close) return;
    animate("#jumping", {
      opacity: [{ to: 0, ease: "in", duration: 200 }],
      autoplay: true,
    });
    animate("#loading-bg", {
      opacity: [{ to: 0, ease: "in", duration: 600 }],
      autoplay: true,
    });
  }, [close]);
  return (
    <div
      id="loading-bg"
      className="z-30 fixed w-screen h-screen bg-orange-faint flex items-center justify-center pointer-events-none"
    >
      <div id="jumping" className="relative w-[408px] h-[300px]">
        <Image
          src={"/assets/loading/dirtback.png"}
          alt="dirt mound"
          width={408}
          height={115}
          className="absolute z-0 bottom-0 left-0"
        />
        {!close && (
          <div className="absolute z-10 bottom-0 left-0 w-full h-full">
            <LogoSpline setClose={setClose} />
          </div>
        )}

        <div className="absolute z-20 bottom-0 left-0 w-full h-20 bg-orange-faint" />
        <Image
          src={"/assets/loading/dirtfront.png"}
          alt="dirt mound"
          width={408}
          height={115}
          className="absolute z-30 bottom-0 left-0"
        />
      </div>
    </div>
  );
}

export default LoadingScreen;
