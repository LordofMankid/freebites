import React, { forwardRef, useCallback } from "react";
import CommonButton from "./common/CommonButton";

interface DonationPromptProps {
  title?: string;
  description?: string;
  altContainerStyle?: string;
}

const DonationPrompt = forwardRef<HTMLDivElement, DonationPromptProps>(
  (props, ref) => {
    const {
      title = "Love what we’re doing?",
      description = "Support us! Your tax-deductible contribution supports our mission to minimize food waste.",
      altContainerStyle = "",
    } = props;

    const handleDonateClick = useCallback(() => {
      // TODO: Add donation link URL here when ready
      console.log("Donate button clicked");
    }, []);

    return (
      <div
        ref={ref}
        className={`w-full flex flex-col justify-center items-start gap-6 bg-orange-faint rounded-4xl sm:rounded-[60px] p-6 sm:p-10 md:p-14 pointer-events-auto ${altContainerStyle}`}
      >
        <div className="flex flex-col gap-3 max-w-3xl">
          <h2 className="font-inter text-xl sm:text-2xl md:text-3xl font-bold text-dark-green tracking-tight">
            {title}
          </h2>
          <p className="font-inter text-base sm:text-lg md:text-xl text-dark-green font-normal leading-relaxed whitespace-nowrap">
            {description}
          </p>
        </div>

        <div className="mt-2">
          <CommonButton
            label="Donate"
            altStyle="bg-orange-medium border-orange-medium rounded-full py-2.5 px-8 sm:py-3.5 sm:px-10"
            altTextStyle="font-semibold text-white text-base sm:text-lg"
            animated={true}
            onClick={handleDonateClick}
          />
        </div>
      </div>
    );
  },
);

DonationPrompt.displayName = "DonationPrompt";

export default DonationPrompt;
