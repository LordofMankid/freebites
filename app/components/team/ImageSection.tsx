import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React from "react";
import ImageWithFallback from "./ImageWithFallback";
interface ImageSectionProps {
  sectionTitle?: string;
  imageCardInfo?: ImageCardProps[];
}

export interface ImageCardProps {
  name?: string; // in the form of first_last
  position?: string;
  src?: string | StaticImport;
}
const ImageSection = (props: ImageSectionProps) => {
  const { sectionTitle, imageCardInfo } = props;

  return (
    <div className="py-8 mx-16 lg:mx-48">
      <p
        className="font-baloo text-dark-text font-semibold 
                    text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center lg:text-left pb-16 w-full"
      >
        {sectionTitle}
      </p>
      <div className="flex flex-wrap justify-center gap-x-24 gap-y-8">
        {imageCardInfo?.map((item: ImageCardProps, idx) => {
          return (
            <div key={idx} className="flex items-center flex-col gap-4">
              <div className="relative h-72 w-72 rounded-2xl bg-amber-50 border-0">
                <ImageWithFallback
                  // key={idx + "image"}
                  src={
                    item.src ??
                    (item.name ? `/assets/photos/${item.name}.jpg` : undefined)
                  }
                  alt={"staff guy"}
                  fill
                  fallbackSrc="/assets/freebites.svg"
                  className="rounded-2xl"
                />
              </div>
              <p className="font-inter font-bold text-3xl">
                {item.name
                  ?.split("_")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")}
              </p>
              <p className="font-inter text-2xl">{item.position}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageSection;
