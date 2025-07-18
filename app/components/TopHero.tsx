import React, { forwardRef, useEffect, useRef, useState } from "react";
import { animate, createScope, createSpring, Scope } from "animejs";
import Image from "next/image";

interface TopHeroProps {
  altContainerStyle?: string;
}
const TopHero = forwardRef<HTMLDivElement, TopHeroProps>((props, ref) => {
  const { altContainerStyle } = props;
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);
  const [hover, setHover] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setHover(true);
    animate("#download", {
      scale: [
        { to: 1.15, ease: createSpring({ stiffness: 400 }), duration: 200 },
      ],
      backgroundColor: [{ to: "#FF952900", ease: "in", duration: 100 }],
    });
    // animate("#download-hover", {
    //   inset: [{ to: 2, ease: "in", duration: 100 }],
    // });
    animate("#download-text", {
      color: [{ to: "#FF9529", ease: "in", duration: 100 }],
    });
  };

  const handleMouseExit = () => {
    setHover(false);
    animate("#download", {
      scale: [{ to: 1, ease: createSpring({ stiffness: 400 }), duration: 400 }],
      backgroundColor: [{ to: "#FF9529FF", ease: "in", duration: 100 }],
    });
    // animate("#download-hover", {
    //   inset: [{ to: 30, ease: "in", duration: 50 }],
    // });
    animate("#download-text", {
      color: [{ to: "#FFF", ease: "in", duration: 100 }],
    });
  };

  useEffect(() => {
    scope.current = createScope({ root });
    return () => {
      if (scope.current) scope.current.revert();
    };
  }, []);
  return (
    <div
      ref={ref}
      className={`w-full min-h-[65vh] flex flex-col justify-center items-center 
                pointer-events-none rounded-4xl 
                sm:rounded-[70px] sm:py-10 sm:px-4 sm:p-40 sm:gap-8  
                lg:py-10 ${altContainerStyle}`}
    >
      <div className="flex flex-col text-center sm:gap-4">
        <p
          className="font-baloo text-2xl 
                      sm:text-5xl md:text-6xl 
                      lg:text-7xl font-bold text-dark-text"
        >
          Find <span className="text-orange-dark">free bites</span> on <br />{" "}
          your campus in real time
        </p>
        <p className="font-inter text-sm sm:text-2xl mt-2 sm:mt-0 text-dark-green">
          Freebites connects college students with free food <br /> from campus
          events before it&apos;s thrown away
        </p>
      </div>
      <div ref={root} className="relative">
        {/* Base button */}
        <a
          id="download"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseExit}
          onClick={handleMouseExit}
          href="https://apps.apple.com/us/app/freebites/id6664051907"
          className="relative z-30 w-fit flex flex-row items-center justify-center gap-2 
                    bg-orange-medium border-2 border-orange-medium rounded-full
                      drop-shadow-[0px_5px_30px_#FF9529]
                      mt-2 py-2 px-5 md:py-3 sm:mt-0 sm:px-10
                      pointer-events-auto"
          // style={{ background: "radial-gradient(#FFF, #FF9529 0%)" }}
        >
          <Image
            src={`/assets/apple${hover ? "Orange" : "White"}.png`}
            alt="apple store logo"
            width={30}
            height={30}
          />
          <p
            id="download-text"
            className="z-30 text-md sm:text-xl font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            Download On App Store
          </p>
        </a>
      </div>
    </div>
  );
});

TopHero.displayName = "TopHero"; // necessary to avoid "unnamed function" warning

export default TopHero;
