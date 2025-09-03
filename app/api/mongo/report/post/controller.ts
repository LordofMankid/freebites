import { GroupedPostReports } from "@/lib/util/types";
import { getPostModel } from "../../post/controller";
import { getUserModel } from "../../user/controller";
import { getReportModel } from "../controller";
import {
  ReportCategory,
  ReportStatus,
} from "@freebites/freebites-types/dist/ReportTypes";

export const getPostReports = async (): Promise<GroupedPostReports[]> => {
  const Reports = await getReportModel();
  const Users = await getUserModel();
  const Posts = await getPostModel();

  // grab reports, posts, and people who made reports, then filter out duplicates + resolved
  const reports = await Reports.find({
    status: { $ne: ReportStatus.RESOLVED },
    type: ReportCategory.POST,
  }).lean();

  const postIds = [
    ...new Set(
      reports.map((r) => {
        if (r.postID) return r.postID;
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
  const [posts, users] = await Promise.all([
    Posts.find({ _id: { $in: postIds } }).lean(),
    Users.find({ uid: { $in: reporterIds } }).lean(),
  ]);

  const postMap = Object.fromEntries(posts.map((p) => [p._id.toString(), p]));
  const userMap = Object.fromEntries(users.map((u) => [u.uid, u]));

  const grouped: Record<string, GroupedPostReports> = {};

  // grouping logic, return null if postInfo or users aren't found or don't exist (e.g. deleted)
  // can handle null cases in the front end
  for (const report of reports) {
    const pid = report.postID;
    if (!grouped[pid]) {
      const postInfo = postMap[pid];

      grouped[pid] = {
        postInfo: postInfo ?? null,
        defendent: userMap[postInfo?.postedBy ?? ""] ?? null,
        reportsWithUsers: [],
      };
    }

    grouped[pid].reportsWithUsers.push({
      ...report,
      reportedBy: userMap[report.reportedByID],
    });
  }

  console.log(grouped);
  return Object.values(grouped);
};
