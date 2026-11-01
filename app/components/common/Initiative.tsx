import { useState } from "react";
import React from "react";
import Image, { StaticImageData } from "next/image";

interface InitiativeProps {
  title: string;
  description: string;
  images?: (string | StaticImageData)[]; // none, one, or several
  color: string;
}

const Initiative = (props: InitiativeProps) => {
  const { title, description, images = [], color } = props;
  const [expanded, setExpanded] = useState(false);
  const hasMore = images.length > 0 && description.length > 100;
  const clamp = images.length > 0 ? "line-clamp-2" : "";

  return (
    <div
      className="flex flex-col rounded-3xl p-6 sm:p-8 font-inter overflow-hidden shadow-sm"
      style={{ backgroundColor: color }}
    >
      {images.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative w-full sm:flex-1 h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden"
            >
              <Image
                src={src}
                alt={images.length > 1 ? `${title} image ${i + 1}` : title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={
                  images.length > 1 ? "object-contain" : "object-cover"
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* content Container */}
      <div className="flex flex-col gap-3">
        <h3 className="text-emerald-950 font-bold text-lg sm:text-lg md:text-2xl leading-tight">
          {title}
        </h3>
        <p
          className={`text-neutral-600 text-base leading-relaxed ${expanded ? "" : clamp}`}
        >
          {description}
        </p>
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="self-start text-neutral-400 font-medium hover:underline text-sm"
          >
            {expanded ? "less" : "more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Initiative;
