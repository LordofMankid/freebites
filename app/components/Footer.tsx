import Link from "next/link";
import Logo from "../assets/freebites.svg";
import CommonButton from "./common/CommonButton";

const Footer = () => {
  return (
    <footer className="w-full bg-orange-faint pointer-events-auto">
      <div className="mx-auto grid min-h-[154px] w-full max-w-[1442px] grid-cols-1 items-center gap-4 px-16 py-8 sm:grid-cols-3 sm:gap-8 sm:px-20 lg:px-24">
        <Link
          href="/"
          className="flex flex-row items-center justify-center gap-5 sm:justify-self-start"
        >
          <Logo className="w-7 h-10" />
          <p className="font-inter text-[21px] font-semibold leading-[28px] text-[#211f1f]">
            Freebites
          </p>
        </Link>
        <a
          href="mailto:freebites7@gmail.com"
          className="justify-self-center font-inter text-[22px] font-normal leading-[34px] tracking-[0.5px] text-[#211f1f]"
        >
          freebites7@gmail.com
        </a>
        {/* TODO: Donate doesn't direct to a page yet, just has homepage as placeholder */}
        <Link href="/" className="justify-self-center sm:justify-self-end">
          <CommonButton
            label="Donate"
            altStyle="bg-orange-medium border-orange-medium h-[54px] w-[151px] px-0 py-0 rounded-[100px]"
            altTextStyle="font-inter font-semibold text-[20px] leading-none tracking-[0.5px] text-white"
            animated
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
