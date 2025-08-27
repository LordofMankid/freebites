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
      <div
        id="jumping"
        className="relative w-[300px] sm:w-[408px] h-[221px] sm:h-[300px]"
      >
        <div className="absolute z-0 bottom-0 left-0 w-full h-[85px] sm:h-[115px]">
          <Image src={"/assets/loading/dirtback.png"} alt="dirt mound" fill />
        </div>
        {!close && (
          <div className="absolute z-10 bottom-0 left-0 w-full h-full">
            <LogoSpline setClose={setClose} />
          </div>
        )}

        <div className="absolute z-20 bottom-0 left-0 w-full h-16 sm:h-20 bg-orange-faint" />
        <div className="absolute z-30 bottom-0 left-0 w-full h-[85px] sm:h-[115px]">
          <Image src={"/assets/loading/dirtfront.png"} alt="dirt mound" fill />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
