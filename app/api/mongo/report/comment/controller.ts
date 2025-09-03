import { GroupedCommentReports } from "@/lib/util/types";
import { getUserModel } from "../../user/controller";
import { getReportModel } from "../controller";
import { getCommentModel } from "../../comment/controller";
import {
  ReportCategory,
  ReportStatus,
} from "@freebites/freebites-types/dist/ReportTypes";

export const getCommentReports = async (): Promise<GroupedCommentReports[]> => {
  const Reports = await getReportModel();
  const Users = await getUserModel();
  const Comments = await getCommentModel();

  // grab reports, posts, and people who made reports, then filter out duplicates
  const reports = await Reports.find({
    status: { $eq: ReportStatus.RESOLVED },
    type: ReportCategory.COMMENT,
  }).lean();

  const commentIds = [
    ...new Set(
      reports.map((r) => {
        if (r.postID) return r.postID; // commentIds are postIds in the schema
      })
    ),
  ];

  const reporterIds = [
    ...new Set(
      reports.map((r) => {
        if (r.reportedByID) return r.reportedByID;
      })
    ),
  ];

  // fetch, sort, and group
  const [comments, users] = await Promise.all([
    Comments.find({ _id: { $in: commentIds } }).lean(),
    Users.find({ uid: { $in: reporterIds } }).lean(),
  ]);

  const commentMap = Object.fromEntries(
    comments.map((p) => [p._id.toString(), p])
  );
  const userMap = Object.fromEntries(users.map((u) => [u.uid, u]));

  const grouped: Record<string, GroupedCommentReports> = {};

  // grouping logic, return null if postInfo or users aren't found or don't exist (e.g. deleted)
  // can handle null cases in the front end
  for (const report of reports) {
    const pid = report.postID;
    if (!grouped[pid]) {
      const commentInfo = commentMap[pid];

      grouped[pid] = {
        commentInfo: commentInfo ?? null,
        defendent: userMap[commentInfo?.authorId ?? ""] ?? null,
        reportsWithUsers: [],
      };
    }

    grouped[pid].reportsWithUsers.push({
      ...report,
      reportedBy: userMap[report.reportedByID],
    });
  }

  console.log(grouped); // COMMENT OUT OR DELETE LATER
  return Object.values(grouped);
};
