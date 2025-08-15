import { ReportType } from "@freebites/freebites-types";
import { getReportModel } from "../controller";

export const patchReportController = async (
  reportId: string,
  updates: Partial<ReportType>
): Promise<ReportType> => {
  try {
    const Report = await getReportModel();

    if (!reportId || !updates) {
      throw new Error("Missing required information");
    }

    // Don't include _id in updates
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateFields } = updates;

    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    )
      .lean()
      .exec();

    if (!updatedReport) {
      throw new Error(`Report with id ${reportId} not found`);
    }

    return updatedReport;
  } catch (error) {
    console.error("Error updating report", error);
    throw error;
  }
};
