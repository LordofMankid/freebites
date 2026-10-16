import React, { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CommonButton from "./common/CommonButton";

interface SupportSectionProps {
  altContainerStyle?: string;
}

const SupportSection = forwardRef<HTMLDivElement, SupportSectionProps>(
  (props, ref) => {
    const { altContainerStyle = "" } = props;

    return (
      <section
        ref={ref}
        className={`w-full bg-orange-faint py-14 sm:py-20 lg:py-24 pointer-events-auto ${altContainerStyle}`}
      >
        <div className="max-w-[1442px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-14">
          <div className="w-full max-w-[596px] lg:w-1/2 flex-shrink-0">
            <div className="relative w-full aspect-[596/356.33] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/assets/photos/freebites_grad_photo.jpg"
                alt="Freebites Team"
                fill
                sizes="(max-width: 1024px) 100vw, 596px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="w-full max-w-[596px] lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-5">
            <h2 className="font-inter font-bold text-2xl sm:text-3xl lg:text-[35px] text-dark-text leading-tight sm:leading-[1.2] max-w-[596px]">
              Support our fight against food waste on college campuses.
            </h2>
            <p className="font-inter font-normal text-base sm:text-lg lg:text-[22px] text-dark-text leading-relaxed lg:leading-[34px] max-w-[596px]">
              Freebites is a 501(c)(3) non-profit. Your tax-deductible contribution supports our mission to minimize food waste.
            </p>
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link href="/">
                <CommonButton
                  label="Donate"
                  altStyle="bg-orange-medium border-orange-medium border-[1.5px] py-2 px-7 sm:py-3.5 sm:px-9 rounded-full"
                  altTextStyle="font-inter font-semibold text-white text-base sm:text-lg"
                  animated={true}
                />
              </Link>
              <Link href="/mission">
                <CommonButton
                  label="Our Mission"
                  altStyle="border-orange-medium border-[1.5px] bg-transparent hover:bg-orange-medium/10 py-2 px-6 sm:py-3.5 sm:px-8 rounded-full"
                  altTextStyle="font-inter font-semibold text-orange-medium text-base sm:text-lg"
                  animated={true}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

SupportSection.displayName = "SupportSection";

export default SupportSection;
