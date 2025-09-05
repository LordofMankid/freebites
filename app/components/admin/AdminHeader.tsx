import SignoutButton from "../forms/SignoutButton";
import Image from "next/image";
import { useAdmin } from "./AdminContext";
import { School, UserRole } from "@freebites/freebites-types";
// import { AdminViewType } from "@/lib/util/types";

interface AdminHeaderProps {
  adminSchoolSelection: string;
  setAdminSchoolSelection: (arg0: string) => void;
}
const AdminHeader = (props: AdminHeaderProps) => {
  const { adminSchoolSelection, setAdminSchoolSelection } = props;
  const { adminSchool, role } = useAdmin();

  const options = ["All Schools"].concat(Object.values(School) as string[]);
  return (
    <div className="flex justify-between w-full">
      <div>
        <h1 className="text-5xl font-medium font-baloo">Moderation</h1>
        <p className="text-xl font-inter text-neutral-light-text">
          View all reported posts, users, and comments here
        </p>
      </div>
      {role === UserRole.ADMIN ? (
        <div className="flex flex-row items-center-safe gap-5">
          {adminSchoolSelection !== "All Schools" && (
            <Image
              alt={`${adminSchoolSelection} logo here`}
              src={`/images/logos/${adminSchoolSelection}Logo.png`}
              width={60}
              height={60}
              className="rounded-4xl"
            />
          )}
          <div className="flex flex-col justify-end text-xl font-inter text-neutral-light-text">
            <select
              className="bg-[#FFE0C0] px-2 py-1 rounded-lg font-inter text-sm w-40"
              defaultValue={"All Schools"}
              onChange={(e) => setAdminSchoolSelection(e.target.value)}
            >
              {options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <SignoutButton />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default AdminHeader;
