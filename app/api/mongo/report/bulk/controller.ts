import { ReportStatus } from "@freebites/freebites-types";
import { getReportModel } from "../controller";

export const ignoreAllReportsForUser = async (userId: string) => {
  const Report = await getReportModel();
  // resolve associated reports
  const reportUpdateResult = await Report.updateMany(
    { defendentID: userId, status: { $ne: ReportStatus.RESOLVED } },
    {
      status: ReportStatus.RESOLVED,
      resolvedAt: new Date(),
      resolvedReason: "Post deleted by admin",
    }
  );
  console.log(
    `Resolved ${reportUpdateResult.modifiedCount} reports for post ${userId}`
  );

  return reportUpdateResult;
};

export const ignoreAllReportsForComment = async (commentId: string) => {
  const Report = await getReportModel();
  // resolve associated reports
  const reportUpdateResult = await Report.updateMany(
    { postID: commentId, status: { $ne: ReportStatus.RESOLVED } },
    {
      status: ReportStatus.RESOLVED,
      resolvedAt: new Date(),
      resolvedReason: "Post deleted by admin",
    }
  );
  console.log(
    `Resolved ${reportUpdateResult.modifiedCount} reports for post ${commentId}`
  );

  return reportUpdateResult;
};

export const ignoreAllReportsForPost = async (postId: string) => {
  const Report = await getReportModel();
  // resolve associated reports
  const reportUpdateResult = await Report.updateMany(
    { postID: postId, status: { $ne: ReportStatus.RESOLVED } },
    {
      status: ReportStatus.RESOLVED,
      resolvedAt: new Date(),
      resolvedReason: "Post deleted by admin",
    }
  );
  console.log(
    `Resolved ${reportUpdateResult.modifiedCount} reports for post ${postId}`
  );

  return reportUpdateResult;
};
