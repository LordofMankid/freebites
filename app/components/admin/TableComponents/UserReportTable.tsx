import { GroupedUserReports } from "@/lib/util/types";

import React, { useCallback } from "react";
import { ignoreAllReportsOnItem } from "@/lib/api/admin/admin";
import { ReportCategory } from "@freebites/freebites-types/dist/ReportTypes";
import DateCell from "./DateCell";
import NamePFPCell from "./NamePFPCell";
interface UserReportTableProps {
  reports: GroupedUserReports[];
}
function UserReportTable(props: UserReportTableProps) {
  const { reports } = props;

  const deleteItem = useCallback(
    async (userIndex: number) => {
      const userId = reports[userIndex].reportedUser?.userName;
      if (!userId) console.log("suspending", userId);
    },
    [reports]
  );

  const ignoreReport = useCallback(
    (userIndex: number) => {
      const userId = reports[userIndex]?.reportedUser?.uid;
      if (!userId) return;

      ignoreAllReportsOnItem(userId, ReportCategory.COMMENT);
    },
    [reports]
  );

  return (
    <table className="w-full mt-6">
      <thead className="bg-[#FFE0C0] text-left [&>tr>th]:font-inter [&>tr>th]:font-normal [&>tr>th]:py-2">
        <tr>
          <th className="pl-6 py-2 rounded-l-xl">Date</th>
          <th>Reported User</th>
          <th>Reporter&apos;s Message</th>
          <th>Reporter</th>
          <th className="rounded-r-xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((user, i) => {
          return (
            <tr
              key={i}
              className="border-b-[#CFCFCF] border-b-1 [&>td]:pt-4 [&>td]:pb-8 [&>td]:align-top"
            >
              <td className="pl-6">
                {user.reportsWithUsers.map((r) => {
                  const date = new Date(r.reportedOn ?? Date.now());
                  return <DateCell key={r._id} date={date} />;
                })}
              </td>
              <td>
                <NamePFPCell user={user.reportedUser} />
              </td>

              <td>
                {user.reportsWithUsers.map((r) => {
                  return (
                    <p key={r._id} className="font-inter text-sm pb-2 max-w-60">
                      {r.reportedText}
                    </p>
                  );
                })}
              </td>
              <td>
                {user.reportsWithUsers.map((r) => {
                  return <NamePFPCell key={r._id} user={r.reportedBy} />;
                })}
              </td>

              <td className="pr-6">
                <div className="flex flex-col gap-4">
                  <button
                    className="bg-[#CDECAB] py-2 px-8 text-sm font-semibold font-inter rounded-full cursor-pointer"
                    onClick={() => ignoreReport(i)}
                  >
                    Ignore Reports
                  </button>
                  <button
                    className="bg-orange-medium py-2 px-8 text-sm font-semibold font-inter text-white rounded-full cursor-pointer"
                    onClick={() => deleteItem(i)}
                  >
                    Suspend User
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default UserReportTable;
