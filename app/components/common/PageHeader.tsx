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
      <p className="font-baloo text-dark-text font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center pb-2">
        {title}
      </p>
      <p className="font-inter text-neutral-light-text font-normal text-base sm:text-lg md:text-xl lg:text-2xl text-center mx-10">
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;
