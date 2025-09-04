import {
  ReportCategory,
  ReportStatus,
  School,
} from "@freebites/freebites-types";
import { getReportModel } from "../controller";

export const getAllReportsCount = async (
  category: ReportCategory | undefined,
  school: School
): Promise<number> => {
  const Reports = await getReportModel();

  // count if ANY kind of report exists against a user
  if (category === ReportCategory.USER) {
    const distinctUsers = await Reports.distinct("defendentID", {
      status: { $ne: ReportStatus.RESOLVED },
      defendentID: { $nin: ["", null] },
      school: school,
    });

    return distinctUsers.filter(Boolean).length;
  }

  // else filter by category
  return Reports.countDocuments({
    status: { $ne: ReportStatus.RESOLVED },
    ...(category && { type: category }),
    school: school,
  }).exec();
};
