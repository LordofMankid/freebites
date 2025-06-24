import React from "react";
import CommonButton from "./common/CommonButton";

const BottomHero = () => {
  return (
    <div className="w-full flex flex-col justify-start items-start bg-orange-faint rounded-[70px] px-20 py-28 gap-8">
      <div className="flex flex-col gap-4">
        <p className="max-w-3xl font-inter text-[52px] font-bold text-dark-green">
          Want to bring Freebites to your school?
        </p>
        <p className="font-inter text-[22px] text-dark-green p-">
          Sign up to be an ambassador :)
        </p>
      </div>
      <div className="flex flex-row gap-2">
        <CommonButton
          label="Sign Up Form"
          altStyle="bg-orange-medium border-orange-medium border-[1.5px] py-4 px-10"
          altTextStyle="font-semibold text-white text-xl"
        />

        <CommonButton
          label="Learn More"
          altStyle="border-orange-medium border-[1.5px] py-4 px-10"
          altTextStyle="font-semibold text-orange-dark text-xl"
        />
      </div>
    </div>
  );
};

export default BottomHero;
