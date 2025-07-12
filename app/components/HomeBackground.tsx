import { Application } from "@pixi/react";
import React, { forwardRef, useRef } from "react";
import FallingFood from "./team/FallingFood";

const HomeBackground = forwardRef<HTMLDivElement, object>((props, ref) => {
  const pixiCanvas = useRef(null);

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
        className="absolute w-full h-screen pointer-events-auto"
        ref={pixiCanvas}
      >
        <Application
          resizeTo={pixiCanvas}
          background={"#FFF5EB"}
          eventMode="auto"
        >
          <FallingFood />
        </Application>
      </div>
    </div>
  );
});

HomeBackground.displayName = "HomeBackground";

export default HomeBackground;
