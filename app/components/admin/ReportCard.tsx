import {
  deleteComment,
  deletePost,
  getComment,
  getPost,
  getUser,
} from "@/lib/api/admin";
import { Comment, PostType, UserType } from "@freebites/freebites-types";
import {
  ReportCategory,
  ReportType,
} from "@freebites/freebites-types/dist/ReportTypes";
import React, { useCallback, useEffect, useState } from "react";

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

  const ignoreReport = useCallback(() => {}, []);

  const deleteItem = useCallback(async () => {
    console.log("deleting item");
    switch (category) {
      case "Post":
        if (reportedID) {
          // set all reports corresponding to this post to resolved
          await deletePost(reportedID);
        }
        break;
      case "User":
        console.log("user banning not implemented yet");
        break;
      case "Comment":
        if (reportedID) {
          // set all reports corresponding to this post to resolved
          await deleteComment(reportedID);
        }
        break;
    }
  }, [category, reportedID]);
  useEffect(() => {
    const getContent = async () => {
      if (reports.length == 0) return;

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

  return (
    <div className="flex flex-col gap-4 w-full relative bg-white rounded-2xl max-w-md items-center p-4">
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
        {!reported && <div className="w-full h-40 bg-grey-300" />}
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
                    {new Date(r.report.reportedOn ?? Date.now()).toDateString()}
                  </p>
                </div>
                <p className="font-inter text-md">
                  {r.report.reportedText ?? "no text given"}
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
          ignore report
        </button>
        <button className="bg-orange-200" onClick={deleteItem}>
          delete {category.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

export default ReportCard;
