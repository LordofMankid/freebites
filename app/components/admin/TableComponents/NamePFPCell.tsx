import { UserTypeWithImageURL } from "@/lib/util/types";
import Image from "next/image";
import React from "react";

interface NamePFPCellProps {
  user: UserTypeWithImageURL | null;
}

function NamePFPCell(props: NamePFPCellProps) {
  const { user } = props;
  return (
    <div className="flex flex-row items-center gap-3 pb-1">
      <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-black">
        <Image
          src={user?.profileURL ?? "/images/logo.png"}
          alt="the reported poster's profile picture"
          fill
        />
      </div>
      <p className="font-inter text-sm">{user?.userName ?? "unknown"}</p>
    </div>
  );
}

export default NamePFPCell;
