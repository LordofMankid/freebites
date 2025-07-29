// components/ImageWithFallback.tsx
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = {
  src?: string | StaticImageData | StaticImport;
  fallbackSrc: string;
  alt: string;
  fill?: boolean;
  className?: string;
};

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { src, fallbackSrc, alt, fill, className } = props;
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
      fill={fill}
      className={className}
      unoptimized // optional: remove if all images are local and you're using next.config.js domains correctly
    />
  );
};

export default ImageWithFallback;
