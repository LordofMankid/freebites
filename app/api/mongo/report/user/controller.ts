import { GroupedUserReports, UserTypeWithImageURL } from "@/lib/util/types";
import { getUserModel } from "../../user/controller";
import { getReportModel } from "../controller";
import { ReportStatus, School } from "@freebites/freebites-types";
import { fetchAdminImageURL } from "@/lib/api/admin/firebase";

export const getAllReportsOnUsers = async (
  school: School
): Promise<GroupedUserReports[]> => {
  const Reports = await getReportModel();
  const Users = await getUserModel();

  // grab reports, posts, and people who made reports, then filter out duplicates + resolved
  const reports = await Reports.find({
    status: { $ne: ReportStatus.RESOLVED }, // no type filter since we want to aggregate all types of reports
    school: school,
  }).lean();

  const defendentIds = [
    ...new Set(
      reports
        .map((r) => r.defendentID)
        .filter((id): id is string => Boolean(id)) // type guard, removes undefined/empty
    ),
  ];

  const reporterIds = [
    ...new Set(
      reports
        .map((r) => r.reportedByID)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  // fetch, sort, and group
  const [defendents, reportedBy] = await Promise.all([
    Users.find({ uid: { $in: defendentIds } }).lean(),
    Users.find({ uid: { $in: reporterIds } }).lean(),
  ]);

  const defendentMap = Object.fromEntries(
    defendents.map((d) => [d.uid.toString(), d])
  );
  const reportedByMap = Object.fromEntries(reportedBy.map((u) => [u.uid, u]));

  const grouped: Record<string, GroupedUserReports> = {};

  // collect promises for image URLs
  const imagePromises: Promise<void>[] = [];

  // grouping logic, return null if postInfo or users aren't found or don't exist (e.g. deleted)
  // can handle null cases in the front end
  for (const report of reports) {
    const did = report.defendentID;

    if (!did) continue; // don't process if did is invalid value
    if (!grouped[did]) {
      const defendent = defendentMap[did];

      // initialize group for one user
      const groupedItem: GroupedUserReports = {
        reportedUser: defendent
          ? ({ ...defendent, profileURL: null } as UserTypeWithImageURL)
          : null,
        reportsWithUsers: [],
      };

      grouped[did] = groupedItem;

      // fetch defendent's profile image
      if (defendent?.profile) {
        imagePromises.push(
          fetchAdminImageURL("profilePictures/" + defendent.profile)
            .then((url) => {
              groupedItem.reportedUser!.profileURL = url;
            })
            .catch((err) => console.warn("Failed to fetch user:", err))
        );
      }
    }

    // handle reporting users
    const reportedBy = reportedByMap[report.reportedByID] ?? null;
    const reportWithUser = {
      ...report,
      reportedBy: reportedBy
        ? ({ ...reportedBy, profileURL: null } as UserTypeWithImageURL)
        : null,
    };

    grouped[did].reportsWithUsers.push(reportWithUser);

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
  // console.log(Object.values(grouped));
  return Object.values(grouped);
};
