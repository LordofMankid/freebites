import { GroupedCommentReports, UserTypeWithImageURL } from "@/lib/util/types";
import { getUserModel } from "../../user/controller";
import { getReportModel } from "../controller";
import {
  ReportCategory,
  ReportStatus,
  School,
} from "@freebites/freebites-types";
import { fetchAdminImageURL } from "@/lib/api/admin/firebase";
import { getCommentModel } from "../../comment/controller";

export const getCommentReports = async (
  school?: School
): Promise<GroupedCommentReports[]> => {
  const Reports = await getReportModel();
  const Users = await getUserModel();
  const Comments = await getCommentModel();

  // grab reports, posts, and people who made reports, then filter out duplicates + resolved
  const reports = await Reports.find({
    status: { $ne: ReportStatus.RESOLVED },
    type: ReportCategory.COMMENT,
    ...(school && { school }),
  }).lean();

  const commentIds = [
    ...new Set(
      reports.map((r) => {
        if (r.postID) return r.postID;
      })
    ),
  ];

  const userIds = [
    ...new Set(
      reports.flatMap((r) => [r.reportedByID, r.defendentID].filter(Boolean)) // remove undefined/null
    ),
  ];

  // fetch, sort, and group
  const [posts, users] = await Promise.all([
    Comments.find({ _id: { $in: commentIds } }).lean(),
    Users.find({ uid: { $in: userIds } }).lean(),
  ]);

  const commentMap = Object.fromEntries(
    posts.map((p) => [p._id.toString(), p])
  );
  const userMap = Object.fromEntries(users.map((u) => [u.uid, u]));

  const grouped: Record<string, GroupedCommentReports> = {};

  // collect for image URLs
  const imagePromises: Promise<void>[] = [];

  // grouping logic, return null if postInfo or users aren't found or don't exist (e.g. deleted)
  // can handle null cases in the front end
  for (const report of reports) {
    const pid = report.postID;
    if (!grouped[pid]) {
      const commentInfo = commentMap[pid];
      const defendent = commentInfo ? userMap[commentInfo.authorId] : null;

      // initialize group for one post
      const groupedItem: GroupedCommentReports = {
        commentInfo: commentInfo ?? null,
        defendent: defendent
          ? ({ ...defendent, profileURL: null } as UserTypeWithImageURL)
          : null,
        reportsWithUsers: [],
      };

      grouped[pid] = groupedItem;

      // fetch images, append to promises that will resolve to either the images or stay as null
      if (defendent?.profile) {
        imagePromises.push(
          fetchAdminImageURL("profilePictures/" + defendent.profile)
            .then((url) => {
              groupedItem.defendent!.profileURL = url;
            })
            .catch((err) =>
              console.warn("Failed to fetch defendent profile URL:", err)
            )
        );
      }
    }

    // handle reporting users
    const reportedBy = userMap[report.reportedByID] ?? null;
    const reportWithUser = {
      ...report,
      reportedBy: reportedBy
        ? ({ ...reportedBy, profileURL: null } as UserTypeWithImageURL)
        : null,
    };

    grouped[pid].reportsWithUsers.push(reportWithUser);

    // fetch reporter profile URL
    if (reportedBy?.profile) {
      imagePromises.push(
        fetchAdminImageURL("profilePictures/" + reportedBy.profile)
          .then((url) => {
            reportWithUser.reportedBy!.profileURL = url;
          })
          .catch((err) =>
            console.warn("Failed to fetch reporter profile URL:", err)
          )
      );
    }
  }

  await Promise.all(imagePromises);
  // console.log(grouped);
  return Object.values(grouped);
};
