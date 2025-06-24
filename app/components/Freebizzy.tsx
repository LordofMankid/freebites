import React from "react";
import { useRef, useEffect } from "react";
import { animate, createScope, createSpring, Scope } from "animejs";
import Logo from "../assets/freebites.svg";

const Freebizzy = () => {
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // test again again
    scope.current = createScope({ root }).add((self) => {
      animate("#logoTitle", {
        scale: [
          { to: 2, ease: "inOut(3)", duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) },
        ],

        loop: true,
        loopDelay: 250,
      });
    });
    return () => {
      if (scope.current) scope.current.revert();
    };
  }, []);
  return (
    <div
      ref={root}
      className="w-screen h-screen flex flex-row justify-center items-center"
    >
      <div id="logoTitle" className="flex flex-col justify-center items-center">
        <Logo />
        <p className="text-4xl font-semibold">Freebizzy</p>
      </div>
    </div>
  );
};

export default Freebizzy;
