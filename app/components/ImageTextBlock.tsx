import Image, { StaticImageData } from "next/image";
import React, { forwardRef } from "react";

interface ImageTextBlockProps {
  src: string | StaticImageData;
  alt: string;
  imgFirst: boolean;
  title: string;
  body: string;
  altContainerStyle?: string;
}
const ImageTextBlock = forwardRef<HTMLDivElement, ImageTextBlockProps>(
  (props: ImageTextBlockProps, ref) => {
    const { src, alt, imgFirst, title, body, altContainerStyle } = props;

    return (
      <div
        ref={ref}
        className={`flex min-w-full xl:min-w-1/2 lg:gap-24 gap-6 items-center ${
          imgFirst ? "flex-col lg:flex-row" : "flex-col lg:flex-row-reverse"
        } justify-between ${altContainerStyle}`}
      >
        <Image
          src={src}
          alt={alt}
          className="min-w-80 w-96 h-auto xl:w-[550px] xl:h-[564px] "
        />
        <div
          className={`w-full flex flex-col justify-center items-center ${
            imgFirst ? "lg:items-end" : "lg:items-start lg:pl-5"
          } flex-1`}
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

ImageTextBlock.displayName = "ImageTextBlock"; // necessary to avoid "unnamed function" warning
export default ImageTextBlock;
