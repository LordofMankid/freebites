import React, { forwardRef, useEffect, useRef } from "react";
import { animate, createScope, createSpring, Scope } from "animejs";

interface TopHeroProps {
  altContainerStyle?: string;
}
const TopHero = forwardRef<HTMLDivElement, TopHeroProps>((props, ref) => {
  const { altContainerStyle } = props;
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);

  const handleMouseEnter = () => {
    animate("#download", {
      scale: [
        { to: 1.15, ease: createSpring({ stiffness: 400 }), duration: 200 },
      ],
      rotate: [
        { to: "4deg", ease: createSpring({ stiffness: 500 }), duration: 200 },
      ],
    });
    animate("#download-hover", {
      inset: [{ to: 2, ease: "in", duration: 100 }],
    });
    animate("#download-text", {
      color: [{ to: "#FF9529", ease: "in", duration: 100 }],
    });
  };

  const handleMouseExit = () => {
    animate("#download", {
      scale: [{ to: 1, ease: createSpring({ stiffness: 400 }), duration: 400 }],
      rotate: [
        { to: "0", ease: createSpring({ stiffness: 500 }), duration: 200 },
      ],
    });
    animate("#download-hover", {
      inset: [{ to: 30, ease: "in", duration: 50 }],
    });
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
      className={`w-full min-h-[65vh] flex flex-col justify-center items-center overflow-hidden
                 rounded-4xl 
                sm:rounded-[70px] sm:py-10 sm:px-4 sm:p-40 sm:gap-8  
                lg:py-10 ${altContainerStyle}`}
    >
      <div className="flex flex-col text-center sm:gap-4">
        <p className="font-baloo text-xl sm:text-4xl font-bold text-dark-text">
          Fighting food waste,
        </p>
        <p
          className="font-baloo text-2xl 
                      sm:text-5xl md:text-6xl 
                      lg:text-7xl font-bold text-dark-text"
        >
          one <span className="text-orange-dark">free bite</span> at a time
        </p>
        <p className="font-inter text-sm sm:text-2xl mt-2 sm:mt-0 text-dark-green">
          Find free bites on your campus in real time.
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
          className="relative z-30 w-fit flex flex-row items-center bg-orange-medium justify-center rounded-full mt-2 py-2 px-5 sm:mt-0 sm:py-4 sm:px-10"
          // style={{ background: "radial-gradient(#FFF, #FF9529 0%)" }}
        >
          <p
            id="download-text"
            className="z-30 text-md sm:text-xl font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            Download Now
          </p>
          <div
            id="download-hover"
            className="absolute z-20 rounded-full bg-orange-faint pointer-events-none"
            style={{
              inset: 30,
            }}
          />
        </a>
        {/* Hover overlay for gradient effect */}
      </div>
    </div>
  );
});

TopHero.displayName = "TopHero"; // necessary to avoid "unnamed function" warning

export default TopHero;
