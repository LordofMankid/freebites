import React, { forwardRef, useCallback } from "react";
import CommonButton from "./common/CommonButton";
import LogoArms from "../assets/arms.svg";
import Link from "next/link";

interface BottomHeroProps {
  altContainerStyle?: string;
}

const BottomHero = forwardRef<HTMLDivElement, BottomHeroProps>((props, ref) => {
  const { altContainerStyle } = props;

  const handleSignupClick = useCallback(() => {
    window.open(
      "https://forms.gle/m87SvcUr1scsnPYj8",
      "_blank",
      "noopener,noreferrer",
    );
  }, []);
  return (
    <div
      ref={ref}
      className={`w-full flex flex-row justify-center md:justify-between items-center gap-8 bg-orange-faint rounded-4xl sm:rounded-[70px] px-10 py-14 sm:px-20 sm:py-28 pointer-events-auto ${altContainerStyle}`}
    >
      <div className={`flex flex-col sm:justify-start sm:items-start sm:gap-8`}>
        <div className="flex flex-col gap-2 sm:gap-4">
          <p className="max-w-3xl font-inter text-xl text- text-center sm:text-left sm:text-4xl lg:text-[52px] font-bold text-dark-green">
            Want to bring Freebites to your school?
          </p>
          <p className="font-inter text-md sm:text-[22px] text-dark-green text-center sm:text-left">
            Sign up to be an ambassador :)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <CommonButton
            label="Sign Up Form"
            altStyle="bg-orange-medium border-orange-medium border-[1.5px] py-2 px-5 sm:py-4 sm:px-10"
            altTextStyle="font-semibold text-white text-lg sm:text-xl"
            animated={true}
            onClick={handleSignupClick}
          />
          <Link href={"/partner"}>
            <CommonButton
              label="Ask a Question"
              altStyle="border-orange-medium border-[1.5px] py-2 px-5 sm:py-4 sm:px-10"
              altTextStyle="font-semibold text-orange-dark text-lg sm:text-xl"
              animated={true}
            />
          </Link>
        </div>
      </div>
      <LogoArms className="max-w-60 lg:max-w-72 hidden md:block" />
    </div>
  );
});

BottomHero.displayName = "BottomHero"; // necessary to avoid "unnamed function" warning
export default BottomHero;
