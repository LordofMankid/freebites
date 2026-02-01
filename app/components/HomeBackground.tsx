import { Application } from "@pixi/react";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import FallingFood from "./team/FallingFood";
import { usePathname } from "next/navigation";

const HomeBackground = forwardRef<HTMLDivElement, object>((props, ref) => {
  const pixiCanvas = useRef(null);
  const pathname = usePathname();
  const [isTouch, setTouch] = useState<boolean>(false);
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setTouch(isTouchDevice);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed z-[-10] w-full h-screen"
      onWheel={(e) => {
        // Allow scroll to propagate
        e.stopPropagation(); // optional, depends on other listeners
      }}
    >
      <div
        className={`absolute w-full h-screen pointer-events-${isTouch ? "none" : "auto"}`}
        ref={pixiCanvas}
      >
        <Application
          resizeTo={pixiCanvas}
          background={"#FFF5EB"}
          eventMode="auto"
        >
          <FallingFood key={pathname} />
        </Application>
      </div>
    </div>
  );
});

HomeBackground.displayName = "HomeBackground";

export default HomeBackground;
