"use client";
import Spline from "@splinetool/react-spline";
import { useRef } from "react";
import { Application } from "@splinetool/runtime";

export default function LogoSpline() {
  const splineRef = useRef<Application | null>(null);
  const onLoad = (splineApp: Application) => {
    splineRef.current = splineApp;
    const carrot = splineApp.findObjectByName("Carrot");
    if (!carrot) return;
    //idk why but setting all 3 axes as one obj doesn't work
    carrot.scale.x = 20;
    carrot.scale.y = 20;
    carrot.scale.z = 20;

    carrot.position.x = 1000;
    let velocity = 0;
    const grav = -24 * 1000;
    const ground = -6000;
    let y = ground;
    let time = performance.now();

    let angle = 0;
    let turning = false;

    const anim = (currentTime: number) => {
      const deltaTime = (currentTime - time) / 1000;
      time = currentTime;

      velocity += grav * deltaTime;
      y += velocity * deltaTime;
      if (y < ground) {
        y = ground;
        velocity = -grav * 0.73;
      }

      if (y > 0) turning = true;
      if (turning) {
        angle += 5 * Math.PI * deltaTime;
        if (angle >= 2 * Math.PI) {
          angle = 0;
          turning = false;
        }
      }
      carrot.position.y = y;
      carrot.rotation.y = angle;
      requestAnimationFrame(anim);
    };

    requestAnimationFrame(anim);
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
