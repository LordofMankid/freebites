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
      className={`w-full flex ${
        imgFirst ? "flex-row" : "flex-row-reverse"
      } justify-between`}
    >
      <Image src={src} alt={alt} width={550} height={564} />
      <div
        className={`flex flex-col justify-center ${
          imgFirst ? "items-end" : "items-start"
        }`}
      >
        <div className="max-w-96 flex flex-col gap-2">
          <p className="font-baloo font-bold text-5xl">{title}</p>
          <p className="font-inter font-normal text-2xl">{body}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageTextBlock;
