"use client";
import Spline from "@splinetool/react-spline";
import { useRef } from "react";
import { Application } from "@splinetool/runtime";

export default function SplineTest() {
  const splineRef = useRef<Application | null>(null);
  const onLoad = (splineApp: Application) => {
    splineRef.current = splineApp;
    const carrot = splineApp.findObjectByName("Carrot");
    if (!carrot) return;
    // carrot.scale = { x: 3, y: 3, z: 3 };
    carrot.position.x = 250;
    let angle = 0;
    let pos = -200;
    let ascending = true;
    const anim = () => {
      angle += 0.1;
      pos += ascending ? 10 : -10;
      if (pos > 600) ascending = false;
      if (pos < -300) ascending = true;
      carrot.rotation.y = angle;
      carrot.position.y = pos;
      requestAnimationFrame(anim);
    };

    anim();
  };
  return (
    <div className="w-full h-full pointer-events-none">
      <Spline
        scene="https://prod.spline.design/eJaaelfKopc4HxY3/scene.splinecode"
        onLoad={onLoad}
      />
    </div>
  );
}
