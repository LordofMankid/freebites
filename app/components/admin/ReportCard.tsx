import {
  getComment,
  getPost,
  getUser,
  ignoreAllReportsOnItem,
} from "@/lib/api/admin/admin";
import { useDeleteComment, useDeletePost } from "@/lib/hooks/useMutations";
import { Comment, PostType, UserType } from "@freebites/freebites-types";
import {
  ReportCategory,
  ReportType,
} from "@freebites/freebites-types/dist/ReportTypes";
import React, { useCallback, useEffect, useState } from "react";
import CommonButton from "../common/CommonButton";
import Image from "next/image";

interface ReportCardProps {
  category: ReportCategory;
  reportedID?: string;
  reports: ReportType[];
}

/**
 * @deprecated can delete later
 */
function ReportCard(props: ReportCardProps) {
  const { category, reportedID, reports } = props;
  const [reported, setReported] = useState<
    PostType | UserType | Comment | undefined
  >(undefined);
  const [parsedReports, setParsedReports] = useState<
    { report: ReportType; reporter: UserType }[]
  >([]);

  const ignoreReport = useCallback(() => {
    if (reportedID) ignoreAllReportsOnItem(reportedID, category);
  }, [category, reportedID]);

  const deletePostMutation = useDeletePost();
  const deleteCommentMutation = useDeleteComment();

  const dateParser = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let hour = date.getHours();
    let ampm = "am";
    if (hour >= 12) {
      ampm = "pm";
      if (hour > 12) hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}, ${hour}:${minutes} ${ampm}`;
  };
  const deleteItem = useCallback(async () => {
    console.log("deleting item", category);
    switch (category) {
      case "Post":
        if (reportedID) {
          // set all reports corresponding to this post to resolved
          await deletePostMutation.mutateAsync(reportedID);
        }
        break;
      case "User":
        console.log("user banning not implemented yet");
        break;
      case "Comment":
        console.log("reported comment", reportedID);
        if (reportedID) {
          // set all reports corresponding to this post to resolved
          await deleteCommentMutation.mutateAsync(reportedID);
        }
        break;
    }
  }, [category, deleteCommentMutation, deletePostMutation, reportedID]);
  useEffect(() => {
    const getContent = async () => {
      if (reports.length == 0 || reported) return;
      // console.log("GET CONTENT FIRED");

      // temp fix to handle where useEffect fires on changing category
      // but before state gets updated, causing lookup on the wrong category
      if (reports[0].type !== category) return;
      // fetching users who made the reports
      try {
        const reportersPromise = await Promise.allSettled(
          reports.map((report) => {
            return getUser(report.reportedByID);
          })
        );

        const reporters = reportersPromise.map((r) =>
          r.status === "fulfilled"
            ? r.value
            : ({ userName: "unknown" } as UserType)
        );

        // zipping together reports and reporters
        const reports_users = reports.map((r, i) => ({
          report: r,
          reporter: reporters[i],
        }));
        setParsedReports(reports_users);

        // if we are reporting a comment with no grouping just use the postID
        const id = reportedID ?? reports[0].postID;

        let data;
        switch (category) {
          case "Post":
            data = await getPost(id);
            break;
          case "User":
            data = await getUser(id);
            break;
          case "Comment":
            data = await getComment(id);
            break;
        }

        setReported(data);
      } catch (error) {
        console.error("error fetching data", error);
      }
    };

    getContent();
  }, [reportedID, reports, category, reported]);
  const isDeleting =
    deletePostMutation.isPending || deleteCommentMutation.isPending;
  return (
    <tr className="border-b-[#CFCFCF] border-b-1 [&>td]:pt-4 [&>td]:pb-8">
      {reported &&
        category == "Post" &&
        (() => {
          const post = reported as PostType;
          return (
            <>
              <td className="pl-6">
                {parsedReports.map((r) => {
                  const date = new Date(r.report.reportedOn ?? Date.now());
                  const dateStr = dateParser(date);

                  return (
                    <div key={r.report._id} className="font-inter text-sm pb-1">
                      {dateStr}
                    </div>
                  );
                })}
              </td>
              <td>
                <div className="relative w-[155px] h-24 bg-orange-dark">
                  <Image
                    src={"/images/logo.png"}
                    alt="image of the reported post"
                    fill
                  />
                </div>
              </td>
              <td>
                {parsedReports.map((r) => {
                  return (
                    <div key={r.report._id} className="font-inter text-sm pb-1">
                      {r.report.reportedText}
                    </div>
                  );
                })}
              </td>
              <td>
                {parsedReports.map((r) => {
                  return (
                    <div
                      key={r.report._id}
                      className="flex flex-row items-center gap-3 pb-1"
                    >
                      <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-black">
                        <Image
                          src="/images/logo.png"
                          alt="the reported poster's profile picture"
                          fill
                        />
                      </div>
                      <p className="font-inter text-sm">
                        {r.reporter.userName}
                      </p>
                    </div>
                  );
                })}
              </td>
              <td>
                <div className="flex flex-row items-center gap-3">
                  <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-black">
                    <Image
                      src="/images/logo.png"
                      alt="the reported poster's profile picture"
                      fill
                    />
                  </div>
                  <p className="font-inter text-sm">
                    {post?.postedBy ?? "none"}
                  </p>
                </div>
              </td>
              <td className="pr-6">
                <div className="flex flex-col gap-4">
                  <button
                    className="bg-[#CDECAB] py-2 px-8 text-sm font-semibold font-inter rounded-full"
                    onClick={ignoreReport}
                  >
                    Ignore Reports
                  </button>
                  <button
                    className="bg-orange-medium py-2 px-8 text-sm font-semibold font-inter text-white rounded-full"
                    onClick={deleteItem}
                  >
                    {isDeleting ? "Deleting..." : `Delete ${category}`}
                  </button>
                </div>
              </td>
            </>
          );
        })()}
      {reported &&
        category == "User" &&
        (() => {
          const user = reported as UserType;
          return (
            <>
              <td className="pl-6">
                {parsedReports.map((r) => {
                  return (
                    <div key={r.report._id}>
                      {new Date(
                        r.report.reportedOn ?? Date.now()
                      ).toDateString()}
                    </div>
                  );
                })}
              </td>
              <td>{user.userName}</td>
              <td>
                {parsedReports.map((r) => {
                  return <div key={r.report._id}>{r.reporter.userName}</div>;
                })}
              </td>
              <td>
                {parsedReports.map((r) => {
                  return <div key={r.report._id}>{r.report.reportedText}</div>;
                })}
              </td>

              <td className="pr-6">
                <div className="flex gap-4">
                  <button className="bg-red-200" onClick={ignoreReport}>
                    ignore reports
                  </button>
                  <CommonButton
                    label="Ignore Reports"
                    altStyle="bg-secondary-100 py-2 px-8"
                    altTextStyle="font-semibold text-white"
                    animated={true}
                    onClick={() => {}}
                  />
                  <button className="bg-orange-200" onClick={deleteItem}>
                    {isDeleting
                      ? "deleting..."
                      : `delete ${category.toLowerCase()}`}
                  </button>
                </div>
              </td>
            </>
          );
        })()}
      {reported &&
        category == "Comment" &&
        (() => {
          const comment = reported as Comment;
          return (
            <>
              <td className="pl-6">
                {parsedReports.map((r) => {
                  return (
                    <div key={r.report._id}>
                      {new Date(
                        r.report.reportedOn ?? Date.now()
                      ).toDateString()}
                    </div>
                  );
                })}
              </td>
              <td>{comment.body}</td>
              <td>{comment.authorId}</td>
              <td>
                {parsedReports.map((r) => {
                  return <div key={r.report._id}>{r.reporter.userName}</div>;
                })}
              </td>
              <td>
                {parsedReports.map((r) => {
                  return <div key={r.report._id}>{r.report.reportedText}</div>;
                })}
              </td>

              <td className="pr-6">
                <div className="flex gap-4">
                  <button className="bg-red-200" onClick={ignoreReport}>
                    ignore reports
                  </button>
                  <button className="bg-orange-200" onClick={deleteItem}>
                    {isDeleting
                      ? "deleting..."
                      : `delete ${category.toLowerCase()}`}
                  </button>
                </div>
              </td>
            </>
          );
        })()}
    </tr>
  );
}

export default ReportCard;
