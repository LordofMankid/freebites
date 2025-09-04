import Image from "next/image";
import React from "react";

interface NamePFPCellProps {
  src: string;
  username: string | null | undefined;
}

function NamePFPCell(props: NamePFPCellProps) {
  const { src, username } = props;
  return (
    <div className="flex flex-row items-center gap-3 pb-1">
      <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-black">
        <Image src={src} alt="the reported poster's profile picture" fill />
      </div>
      <p className="font-inter text-sm">{username ?? "unknown"}</p>
    </div>
  );
}

export default NamePFPCell;
