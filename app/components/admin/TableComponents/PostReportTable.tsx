import { GroupedPostReports } from "@/lib/util/types";
import Image from "next/image";
import { useDeletePost } from "@/lib/hooks/useMutations";

import React, { useCallback } from "react";
import { ignoreAllReportsOnItem } from "@/lib/api/admin/admin";
import { ReportCategory } from "@freebites/freebites-types";
import DateCell from "./DateCell";
import NamePFPCell from "./NamePFPCell";
interface PostReportTableProps {
  reports: GroupedPostReports[];
}
function PostReportTable(props: PostReportTableProps) {
  const { reports } = props;

  const deletePostMutation = useDeletePost();

  const deleteItem = useCallback(
    async (postIndex: number) => {
      const postId = reports[postIndex]?.postInfo?._id;
      if (!postId) return; // exit early if null or undefined

      // safe to call mutateAsync now
      await deletePostMutation.mutateAsync(postId);
    },
    [deletePostMutation, reports],
  );

  const isDeleting = deletePostMutation.isPending;

  const ignoreReport = useCallback(
    (postIndex: number) => {
      const postId = reports[postIndex]?.postInfo?._id;
      if (!postId) return;

      ignoreAllReportsOnItem(postId, ReportCategory.POST);
    },
    [reports],
  );

  return (
    <table className="w-full mt-6">
      <thead className="bg-[#FFE0C0] text-left [&>tr>th]:font-inter [&>tr>th]:font-normal [&>tr>th]:py-2">
        <tr>
          <th className="pl-6 rounded-l-xl">Date</th>
          <th>Image</th>
          <th>Message</th>
          <th>Sender</th>
          <th>Reciever</th>
          <th className="rounded-r-xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((post, i) => {
          return (
            <tr
              key={i}
              className="border-b-[#CFCFCF] border-b-1 [&>td]:pt-4 [&>td]:pb-8 [&>td]:align-top"
            >
              <td className="pl-6">
                {post.reportsWithUsers.map((r) => {
                  const date = new Date(r.reportedOn ?? Date.now());
                  return <DateCell key={r._id} date={date} />;
                })}
              </td>
              <td>
                <div className="relative w-[155px] h-[155px] bg-black rounded-lg overflow-hidden">
                  <Image
                    src={post.postInfo?.imageURIs[0].url ?? "/images/logo.png"}
                    alt="image of the reported post"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </td>
              <td>
                {post.reportsWithUsers.map((r) => {
                  return (
                    <p key={r._id} className="font-inter text-sm pb-2 max-w-60">
                      {r.reportedText}
                    </p>
                  );
                })}
              </td>
              <td>
                {post.reportsWithUsers.map((r) => {
                  return <NamePFPCell key={r._id} user={r.reportedBy} />;
                })}
              </td>
              <td>
                <NamePFPCell user={post.defendent} />
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
