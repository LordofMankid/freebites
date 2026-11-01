import React, { ReactElement } from "react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string | ReactElement;
  altStyle?: string;
}
const PageHeader = (props: PageHeaderProps) => {
  const { title, subtitle, altStyle } = props;
  return (
    <div className={`py-8 ${altStyle}`}>
      <p className="font-baloo text-dark-text font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center pb-2">
        {title}
      </p>
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-wrap text-center font-inter text-neutral-light-text font-normal text-base sm:text-md md:text-lg lg:text-xl">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
