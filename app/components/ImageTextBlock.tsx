import Image, { StaticImageData } from "next/image";
import React from "react";

interface ImageTextBlockProps {
  src: string | StaticImageData;
  alt: string;
  imgFirst: boolean;
  title: string;
  body: string;
}
const ImageTextBlock = (props: ImageTextBlockProps) => {
  const { src, alt, imgFirst, title, body } = props;

  return (
    <div
      className={`flex min-w-full xl:min-w-1/2 gap-20 items-center ${
        imgFirst ? "flex-col lg:flex-row" : "flex-col lg:flex-row-reverse"
      } justify-between`}
    >
      <Image
        src={src}
        alt={alt}
        className="xl:w-[550px] xl:h-[564] h-96 w-96"
      />
      <div
        className={`w-full flex flex-col justify-center items-center ${
          imgFirst ? "lg:items-end" : "lg:items-start pl-5"
        } flex-1`}
      >
        <div className=" max-w-[30rem] flex flex-col gap-2">
          <p className="font-baloo font-bold xl:text-5xl lg:text-4xl text-5xl">
            {title}
          </p>
          <p className="font-inter font-normal xl:text-2xl lg:text-xl text-2xl">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageTextBlock;
