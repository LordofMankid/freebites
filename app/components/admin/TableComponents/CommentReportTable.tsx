import { GroupedCommentReports } from "@/lib/util/types";
import { useDeleteComment } from "@/lib/hooks/useMutations";

import React, { useCallback } from "react";
import { ignoreAllReportsOnItem } from "@/lib/api/admin/admin";
import { ReportCategory } from "@freebites/freebites-types/dist/ReportTypes";
import DateCell from "./DateCell";
import NamePFPCell from "./NamePFPCell";
interface PostReportTableProps {
  reports: GroupedCommentReports[];
}
function PostReportTable(props: PostReportTableProps) {
  const { reports } = props;

  const deleteCommentMutation = useDeleteComment();

  const deleteItem = useCallback(
    async (comIndex: number) => {
      if (reports[comIndex].commentInfo._id) {
        // set all reports corresponding to this post to resolved
        await deleteCommentMutation.mutateAsync(
          reports[comIndex].commentInfo._id
        );
      }
    },
    [deleteCommentMutation, reports]
  );

  const isDeleting = deleteCommentMutation.isPending;

  const ignoreReport = useCallback(
    (comIndex: number) => {
      if (reports[comIndex].commentInfo._id)
        ignoreAllReportsOnItem(
          reports[comIndex].commentInfo._id,
          ReportCategory.COMMENT
        );
    },
    [reports]
  );

  return (
    <table className="w-full mt-6">
      <thead className="bg-[#FFE0C0] text-left [&>tr>th]:font-inter [&>tr>th]:font-normal [&>tr>th]:py-2">
        <tr>
          <th className="pl-6 py-2 rounded-l-xl">Date</th>
          <th>Reported Comment</th>
          <th>Message</th>
          <th>Commenter</th>
          <th>Reporter</th>
          <th className="rounded-r-xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((comment, i) => {
          return (
            <tr
              key={i}
              className="border-b-[#CFCFCF] border-b-1 [&>td]:pt-4 [&>td]:pb-8 [&>td]:align-top"
            >
              <td className="pl-6">
                {comment.reportsWithUsers.map((r) => {
                  const date = new Date(r.reportedOn ?? Date.now());
                  return <DateCell key={r._id} date={date} />;
                })}
              </td>
              <td>
                <p className="font-inter text-sm pb-2 max-w-60">
                  {comment.commentInfo?.body ?? "comment not found"}
                </p>
              </td>
              <td>
                {comment.reportsWithUsers.map((r) => {
                  return (
                    <p key={r._id} className="font-inter text-sm pb-2 max-w-60">
                      {r.reportedText}
                    </p>
                  );
                })}
              </td>
              <td>
                {comment.reportsWithUsers.map((r) => {
                  return (
                    <NamePFPCell
                      key={r._id}
                      src="/images/logo.png"
                      username={r.reportedBy?.userName}
                    />
                  );
                })}
              </td>
              <td>
                <NamePFPCell
                  src="/images/logo.png"
                  username={comment.defendent?.userName}
                />
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
                    {isDeleting ? "Deleting..." : `Delete Post`}
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

export default PostReportTable;
