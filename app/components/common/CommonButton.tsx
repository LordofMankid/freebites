"use client";
import { animate, createSpring } from "animejs";
import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";
interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  altStyle?: string;
  altTextStyle?: string;
  disabled?: boolean;
  type?: HTMLButtonElement["type"];
  noFocusStyle?: boolean;
  hover?: boolean;
  animated?: boolean;
}

/**
 * Our internal button component which includes options for icons and adheres to our own styling system.
 * @param props: label
 * @param optional props: left/right icons, alternate Tailwind classes for the text and the
 * @returns a React Components.
 * @TODO: add in loading components
 */

const CommonButton = (props: ButtonProps) => {
  const {
    label,
    onClick,
    leftIcon,
    rightIcon,
    altStyle,
    altTextStyle,
    disabled,
    type,
    animated,
  } = props;

  const btn = useRef(null);

  const handleMouseEnter = () => {
    if (!animated || !btn.current) return;
    animate(btn.current, {
      scale: [
        { to: 1.05, ease: createSpring({ stiffness: 400 }), duration: 150 },
      ],
    });
  };
  const handleMouseLeave = () => {
    if (!animated || !btn.current) return;
    animate(btn.current, {
      scale: [{ to: 1, ease: createSpring({ stiffness: 400 }), duration: 300 }],
    });
  };

  // if icon isn't passed in, nothing will show
  return (
    // <div  className="w-full h-full">
    <button
      ref={btn}
      onClick={onClick}
      className={twMerge(
        `flex flex-row items-center justify-center gap-2 py-2.5 px-5 min-w-max border rounded-[100px] border-[#211f1f] cursor-pointer ${altStyle}`
      )}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type={type ?? "button"}
    >
      {leftIcon ? leftIcon : null}
      <p
        className={twMerge(
          `text-dark-blue text-sm font-medium font-[family-name:var(--font-rubik)] ${altTextStyle}`
        )}
      >
        {label}
      </p>

      {rightIcon ? rightIcon : null}
    </button>
    // </div>
  );
};

export default CommonButton;
