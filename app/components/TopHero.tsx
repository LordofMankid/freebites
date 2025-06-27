import React from "react";

const TopHero = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center bg-orange-faint rounded-4xl sm:rounded-[70px] py-10 px-8 sm:p-40 sm:gap-8">
      <div className="flex flex-col text-center sm:gap-4">
        <p className="font-baloo text-xl sm:text-4xl font-bold text-dark-text">
          Fighting food waste,
        </p>
        <p className="font-baloo text-2xl sm:text-7xl font-bold text-dark-text">
          one <span className="text-orange-dark">free bite</span> at a time
        </p>
        <p className="font-inter text-sm sm:text-2xl mt-2 sm:mt-0 text-dark-green">
          Freebites helps college students find and share free food
          opportunities on campus in an effort to combat food waste and
          insecurity.
        </p>
      </div>
      <a
        href="https://apps.apple.com/us/app/freebites/id6664051907"
        className="w-fit flex flex-row items-center justify-center rounded-full bg-orange-medium mt-2 py-2 px-5 sm:mt-0 sm:py-4 sm:px-10"
      >
        <p className="text-white text-md sm:text-xl font-semibold">
          Download Now
        </p>
      </a>
    </div>
  );
};

export default TopHero;
