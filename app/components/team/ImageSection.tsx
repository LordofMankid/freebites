import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";
interface ImageSectionProps {
  sectionTitle?: string;
  imageCardInfo?: ImageCardProps[];
}

export interface ImageCardProps {
  name?: string;
  position?: string;
  src?: string | StaticImport;
}
const ImageSection = (props: ImageSectionProps) => {
  const { sectionTitle, imageCardInfo } = props;
  return (
    <div className="py-8 mx-48">
      <p className="font-baloo text-dark-text font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-left pb-2">
        {sectionTitle}{" "}
      </p>
      <div className="grid grid-cols-3 gap-x-24 gap-y-8">
        {imageCardInfo?.map((item: ImageCardProps, idx) => {
          return (
            <div key={idx} className="flex items-center flex-col gap-4">
              <div className="relative h-72 w-72 rounded-2xl bg-amber-50 border-0">
                <Image
                  // key={idx + "image"}
                  src={item.src ?? "/assets/freebites.svg"}
                  alt={"staff guy"}
                  fill
                ></Image>
              </div>
              <p className="font-inter font-bold text-3xl">{item.name}</p>
              <p className="font-inter text-2xl">{item.position}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageSection;
