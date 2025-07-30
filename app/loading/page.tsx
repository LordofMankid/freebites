import Image from "next/image";
import React from "react";
import LogoSpline from "../components/LogoSpline";

function LoadingPage() {
  return (
    <div className="w-screen h-screen bg-orange-faint flex items-center justify-center">
      <div className="relative w-[408px] h-[300px]">
        <Image
          src={"/assets/loading/dirtback.png"}
          alt="dirt mound"
          width={408}
          height={115}
          className="absolute z-0 bottom-0 left-0"
        />
        <div className="absolute z-10 bottom-0 left-0 w-full h-full">
          <LogoSpline />
        </div>
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

export default LoadingPage;
