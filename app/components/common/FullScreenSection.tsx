import React, { forwardRef } from "react";

interface FullScreenSection {
  title: string;
  body: string;
  altContainerStyle?: string;
}
const FullScreenSection = forwardRef<HTMLDivElement, FullScreenSection>(
  (props: FullScreenSection, ref) => {
    const { title, body, altContainerStyle } = props;

    return (
      <div
        ref={ref}
        className={`flex min-w-full min-h-[80vh] xl:min-w-1/2 lg:gap-24 gap-6
                    flex-col lg:flex-row-reverse justify-between ${altContainerStyle}`}
      >
        <div
          className={`w-full flex flex-col justify-start items-start lg:items-endlg:items-start lg:pl-5
           flex-1`}
        >
          <div className="w-[100%] sm:max-w-[30rem] flex flex-col gap-2">
            <p className="font-baloo font-bold xl:text-5xl lg:text-4xl sm:text-5xl text-2xl text-center lg:text-left">
              {title}
            </p>
            <p className="font-inter font-normal xl:text-2xl lg:text-xl sm:text-2xl text-md text-center lg:text-left">
              {body}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

FullScreenSection.displayName = "ImageTextBlock"; // necessary to avoid "unnamed function" warning
export default FullScreenSection;
