import Image from "next/image";
import React, { forwardRef } from "react";

interface FullScreenSection {
  title: string;
  body: string;
  altContainerStyle?: string;
  image?: string;
  images?: string[];
}
const FullScreenSection = forwardRef<HTMLDivElement, FullScreenSection>(
  (props: FullScreenSection, ref) => {
    const { title, body, altContainerStyle, image, images } = props;

    return (
      <div
        ref={ref}
        className={`flex min-w-full min-h-[80vh] xl:min-w-1/2 lg:gap-24 gap-6
                    flex-col lg:flex-row-reverse justify-between ${altContainerStyle}`}
      >
        <div
          className={`w-full flex flex-col justify-start items-center md:items-start lg:pl-5
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
          {image && (
            // <div className="flex-1 flex justify-center items-center md:hidden">
            <Image
              src={image}
              alt={title}
              className="w-full max-h-[70vh] object-contain md:hidden mt-4"
              width={400}
              height={500}
            />
          )}

          {images && (
            <div className="flex flex-col mt-4 w-full items-center justify-center">
              {images.map((image) => (
                <div key={image} className="flex w-full justify-center">
                  <Image
                    src={image}
                    alt={title}
                    className="object-contain md:hidden m-auto"
                    width={400}
                    height={400}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FullScreenSection.displayName = "ImageTextBlock"; // necessary to avoid "unnamed function" warning
export default FullScreenSection;
