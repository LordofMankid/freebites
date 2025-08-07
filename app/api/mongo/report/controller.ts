import { ReportSchema, ReportType } from "@freebites/freebites-types";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import { ReportCategory } from "@freebites/freebites-types/dist/ReportTypes";

let ReportModel: mongoose.Model<ReportType> | null = null;

export const getReportModel = async (): Promise<mongoose.Model<ReportType>> => {
  if (ReportModel) return ReportModel;

  const conn = await connectToDatabase();

  ReportModel =
    conn.models.Report ||
    conn.model<ReportType>("Report", ReportSchema, "reports");
  return ReportModel;
};

export const getAllReports = async (
  category: ReportCategory | undefined
): Promise<ReportType[]> => {
  const Reports = await getReportModel();
  return Reports.find(category ? { type: category } : {}).exec();
};

export const getReportById = async (id: string): Promise<ReportType> => {
  const Report = await getReportModel();
  try {
    const report = await Report.findOne({ _id: id }).exec();
    if (report) return report;
    else throw new Error("Report not found!");
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
};

export const putReportController = async (
  reportData: ReportType
): Promise<ReportType> => {
  try {
    const User = await getReportModel();
    if (!reportData) {
      throw new Error("Missing required information");
    }

    const updatedUser = await User.findOneAndReplace(
      { uid: reportData._id },
      reportData,
      {
        new: true,
      }
    )
      .lean() // save as javascript document for less overhead
      .exec();

    if (!updatedUser) {
      throw new Error(`User with uid ${reportData._id} not found`);
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};
