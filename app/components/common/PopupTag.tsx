import React, { forwardRef } from "react";

interface PopupTagProps {
  text: string;
  //   body: string;
  altContainerStyle?: string;
}
const PopupTag = forwardRef<HTMLDivElement, PopupTagProps>(
  (props: PopupTagProps, ref) => {
    const { text, altContainerStyle } = props;

    return (
      <div
        ref={ref}
        className={`rounded-lg px-4 py-2 bg-orange-medium ${altContainerStyle}`}
      >
        <p className="font-inter text-white">{text}</p>
      </div>
    );
  }
);

PopupTag.displayName = "ImageTextBlock"; // necessary to avoid "unnamed function" warning
export default PopupTag;
