import SignoutButton from "../forms/SignoutButton";
import Image from "next/image";
import { useAdmin } from "./AdminContext";
// import { AdminViewType } from "@/lib/util/types";

const AdminHeader = () => {
  const { adminSchool } = useAdmin();
  return (
    <div className="flex justify-between w-full">
      <div>
        <h1 className="text-5xl font-medium font-baloo">Moderation</h1>
        <p className="text-xl font-inter text-neutral-light-text">
          View all reported posts, users, and comments here
        </p>
      </div>
      {/* <select
        onChange={(e) => {
          setViewState(e.target.value as AdminViewType); // cast because it's just from the options
        }}
      >
        {Object.values(AdminViewType).map((viewType) => (
          <option key={viewType} value={viewType}>
            {viewType}
          </option>
        ))}
      </select> */}
      <div className="flex flex-row items-center-safe gap-5">
        <Image
          alt={`${adminSchool} logo here`}
          src="/images/logos/HarvardLogo.png"
          width={60}
          height={60}
          className="rounded-4xl"
        />
        <div className="flex flex-col justify-end text-xl font-inter text-neutral-light-text">
          <p className="text-neutral-light-text font-bold">{adminSchool}</p>
          <SignoutButton />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
