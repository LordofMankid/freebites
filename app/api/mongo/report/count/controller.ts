import {
  ReportCategory,
  ReportStatus,
} from "@freebites/freebites-types/dist/ReportTypes";
import { getReportModel } from "../controller";

export const getAllReportsCount = async (
  category: ReportCategory | undefined
): Promise<number> => {
  const Reports = await getReportModel();

  // count if ANY kind of report exists against a user
  if (category === ReportCategory.USER) {
    const distinctUsers = await Reports.distinct("defendentID", {
      status: { $ne: ReportStatus.RESOLVED },
      defendentID: { $nin: ["", null] },
    });

    return distinctUsers.filter(Boolean).length;
  }

  // else filter by category
  return Reports.countDocuments({
    status: { $ne: ReportStatus.RESOLVED },
    ...(category && { type: category }),
  }).exec();
};
