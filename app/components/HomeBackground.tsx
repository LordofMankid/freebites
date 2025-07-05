import React, { forwardRef, useEffect, useRef, useState } from "react";
import { animate, createScope, Scope } from "animejs";

interface circleType {
  id: number;
  x: number;
  y: number;
}

const HomeBackground = forwardRef<HTMLDivElement, object>((props, ref) => {
  const root = useRef(null);
  const circleID = useRef<number>(0);
  const scope = useRef<Scope | null>(null);
  const [circles, setCircles] = useState<circleType[]>([]);

  const circleDuration = 8;

  useEffect(() => {
    if (circles.length > 0) {
      const latestCircle = circles[circles.length - 1];
      const circleElement = document.getElementById(`circle${latestCircle.id}`);

      if (circleElement) {
        animate("#circle" + latestCircle.id, {
          scale: { to: 25, ease: "inOut(3)", duration: circleDuration * 1000 },
          opacity: [
            { to: 1, ease: "inOut(3)", duration: 1000 },
            {
              to: 0,
              ease: "inOut(3)",
              duration: (circleDuration - 1.5) * 1000,
            },
          ],
        });
      }
    }
  }, [circles, circleDuration]);

  useEffect(() => {
    scope.current = createScope({ root });

    let timer: NodeJS.Timeout;

    const spawnCircle = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const id = circleID.current++;
      setCircles((prev) => [...prev, { id: id, x: x, y: y }]);

      timer = setTimeout(spawnCircle, Math.random() * 2000 + 500);
      setTimeout(() => {
        setCircles((prev) => prev.filter((c) => c.id !== id));
      }, circleDuration * 1000);
    };

    spawnCircle();

    return () => {
      if (scope.current) scope.current.revert();
      clearTimeout(timer);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="fixed z-[-10] w-full h-screen blur-md pointer-events-none"
    >
      <div ref={root} className="absolute w-full h-full overflow-clip">
        {circles.map((c) => {
          return (
            <div
              key={c.id}
              id={"circle" + c.id}
              className="absolute w-8 h-8 bg-transparent border-2 border-orange-medium rounded-full"
              style={{ top: c.y, left: c.x, opacity: 0 }}
            />
          );
        })}
      </div>
      <div className="w-full h-full bg-orange-faint" />
    </div>
  );
});

HomeBackground.displayName = "HomeBackground";

export default HomeBackground;
