import { Application } from "@pixi/react";
import React, { forwardRef, useRef } from "react";
import FallingFood from "./team/FallingFood";

const HomeBackground = forwardRef<HTMLDivElement, object>((props, ref) => {
  const pixiCanvas = useRef(null);

  return (
    <div
      ref={ref}
      className="fixed z-[-10] w-full h-screen pointer-events-none"
    >
      <div className="w-full h-screen" ref={pixiCanvas}>
        <Application resizeTo={pixiCanvas} background={"#FFF5EB"}>
          <FallingFood />
        </Application>
      </div>
    </div>
  );
});

HomeBackground.displayName = "HomeBackground";

export default HomeBackground;
