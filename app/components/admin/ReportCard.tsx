import {
  getComment,
  getPost,
  getUser,
  ignoreAllReportsOnItem,
} from "@/lib/api/admin";
import { useDeleteComment, useDeletePost } from "@/lib/hooks/useMutations";
import { Comment, PostType, UserType } from "@freebites/freebites-types";
import {
  ReportCategory,
  ReportType,
} from "@freebites/freebites-types/dist/ReportTypes";
import React, { useCallback, useEffect, useState } from "react";
import CommonButton from "../common/CommonButton";

interface ReportCardProps {
  category: ReportCategory;
  reportedID?: string;
  reports: ReportType[];
}

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
      console.log("GET CONTENT FIRED");

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
  }, [reportedID, reports, category]);
  const isDeleting =
    deletePostMutation.isPending || deleteCommentMutation.isPending;
  return (
    <tr className="border-b-[#CFCFCF] border-b-1 [&>td]:pt-4 [&>td]:pb-8">
      {reported &&
        category == "Post" &&
        (() => {
          console.log("INSIDE POSTING AREA");
          const post = reported as PostType;
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
              <td>{post?.imageURIs ?? "none"}</td>
              <td>
                {parsedReports.map((r) => {
                  return <div key={r.report._id}>{r.report.reportedText}</div>;
                })}
              </td>
              <td>
                {parsedReports.map((r) => {
                  return <div key={r.report._id}>{r.reporter.userName}</div>;
                })}
              </td>
              <td>{post?.postedBy ?? "none"}</td>
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
{
  /* <div className="flex flex-col gap-4 w-full relative bg-white rounded-2xl max-w-md items-center p-4">
        <div className="flex flex-col w-full">
          <p className="font-inter text-2xl">Reported {category}:</p>
          {reported &&
            category == "Post" &&
            (() => {
              const post = reported as PostType;
              return (
                <div className="w-full h-40 bg-blue-100">
                  <p>{post.description}</p>
                  <p>{post.locationName}</p>
                </div>
              );
            })()}
          {reported &&
            category == "User" &&
            (() => {
              const user = reported as UserType;
              return (
                <div className="w-full h-40 bg-rose-100">
                  <p>{user.userName}</p>
                  <p>{user.pronouns}</p>
                </div>
              );
            })()}
          {reported &&
            category == "Comment" &&
            (() => {
              const comment = reported as Comment;
              return (
                <div className="w-full h-40 bg-green-100">
                  <p>{comment.username}</p>
                  <p>{comment.body}</p>
                </div>
              );
            })()}
          {!reported && (
            <div className="w-full h-40 bg-grey-300">
              <p>This {category.toLowerCase()} has been deleted.</p>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          {parsedReports.length != 0 ? (
            parsedReports.map((r) => {
              return (
                <div
                  key={r.report._id}
                  className="flex flex-col w-full  bg-gray-100 gap-1"
                >
                  <div className="flex justify-between w-full bg-gray-200 items-center">
                    <div className="h-full flex gap-2 items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-sm" />
                      <p className="font-inter text-lg">
                        {r.reporter.userName ?? "unknown"}
                      </p>
                    </div>
                    <p className="font-inter text-md">
                      {new Date(
                        r.report.reportedOn ?? Date.now()
                      ).toDateString()}
                    </p>
                  </div>
                  <p className="font-inter text-md">
                    {r.report.reportedText ?? "no text given"}
                  </p>
                  <p
                    className={`font-inter text-md 
                    ${r.report.status === ReportStatus.RESOLVED ? "text-emerald-700" : "text-orange-medium"}`}
                  >
                    {r.report.status}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col w-full  bg-gray-100 gap-1">
              <div className="flex justify-between w-full bg-gray-200 items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-sm" />
              </div>
              <p className="h-5" />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button className="bg-red-200" onClick={ignoreReport}>
            ignore reports
          </button>
          <button className="bg-orange-200" onClick={deleteItem}>
            {isDeleting ? "deleting..." : `delete ${category.toLowerCase()}`}
          </button>
        </div>
      </div> */
}

export default ReportCard;
