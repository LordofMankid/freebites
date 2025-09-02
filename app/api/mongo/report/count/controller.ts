import {
  ReportCategory,
  ReportStatus,
} from "@freebites/freebites-types/dist/ReportTypes";
import { getReportModel } from "../controller";

export const getAllReportsCount = async (
  category: ReportCategory | undefined
): Promise<number> => {
  const Reports = await getReportModel();
  return Reports.countDocuments({
    status: { $ne: ReportStatus.RESOLVED },
    ...(category && { type: category }),
  }).exec();
};
