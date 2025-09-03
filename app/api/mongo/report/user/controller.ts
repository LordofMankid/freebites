import { GroupedUserReports } from "@/lib/util/types";
import { getUserModel } from "../../user/controller";
import { getReportModel } from "../controller";
import { ReportStatus } from "@freebites/freebites-types/dist/ReportTypes";

export const getAllReportsOnUsers = async (): Promise<GroupedUserReports[]> => {
  const Reports = await getReportModel();
  const Users = await getUserModel();

  // grab reports, posts, and people who made reports, then filter out duplicates + resolved
  const reports = await Reports.find({
    status: { $ne: ReportStatus.RESOLVED }, // no type filter since we want to aggregate all types of reports
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

  // grouping logic, return null if postInfo or users aren't found or don't exist (e.g. deleted)
  // can handle null cases in the front end
  for (const report of reports) {
    const did = report.defendentID;

    if (!did) continue; // don't process if did is invalid value
    if (!grouped[did]) {
      const defendentInfo = defendentMap[did];

      grouped[did] = {
        reportedUser: defendentInfo ?? null,
        reportsWithUsers: [],
      };
    }

    grouped[did].reportsWithUsers.push({
      ...report,
      reportedBy: reportedByMap[report.reportedByID],
    });
  }

  console.log(Object.values(grouped));
  return Object.values(grouped);
};
