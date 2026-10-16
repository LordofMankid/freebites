import React from "react";
import Image from "next/image";

interface InitiativeProps {
  title: string;
  description: string;
  image?: string;
  color: string;
}

const Initiative = (props: InitiativeProps) => {
  const { title, description, image, color } = props;

  return (
    <div
      className="flex flex-col rounded-3xl p-6 sm:p-8 font-inter overflow-hidden shadow-sm"
      style={{ backgroundColor: color }}
    >
      {/* image container */}
      {image && (
        <div className="relative w-full h-64 sm:h-72 mb-6 flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            fill
            sizes="100vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}

      {/* content Container */}
      <div className="flex flex-col gap-3">
        <h3 className="text-emerald-950 font-bold text-xl sm:text-2xl md:text-3xl leading-tight">
          {title}
        </h3>

        {/* description, hidden on small screens */}
        <p className="hidden sm:block text-neutral-600 font-normal text-base md:text-lg leading-relaxed">
          {description}
          <span className="text-neutral-400 cursor-pointer font-medium hover:underline">
            {/* TODO: add more... functionality */}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Initiative;
