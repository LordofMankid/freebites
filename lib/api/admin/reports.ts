////////////////////////////////////////////
// report crud

import {
  GroupedCommentReports,
  GroupedPostReports,
  GroupedUserReports,
} from "@/lib/util/types";
import { ReportType } from "@freebites/freebites-types";
import { ReportCategory } from "@freebites/freebites-types";
import axios from "axios";

export const getReport = async (reportId: string): Promise<ReportType> => {
  try {
    const response = await axios.get("/api/mongo/report", {
      params: { id: reportId },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch report: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch report: An unknown error occurred.`);
    }
  }
};

export const getAllReports = async (
  category?: ReportCategory
): Promise<ReportType[]> => {
  try {
    const response = await axios.get("/api/mongo/report", {
      params: category ? { category: category } : {},
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch reports: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch reports: An unknown error occurred.`);
    }
  }
};

export const getReportCountByCategory = async (
  school: string,
  category?: ReportCategory
): Promise<number> => {
  try {
    const response = await axios.get("/api/mongo/report/count", {
      params: category ? { category: category, school: school } : {},
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch report count: ${error.message}`);
    } else {
      throw new Error(
        `Failed to fetch report count: An unknown error occurred.`
      );
    }
  }
};

export const getReportsGroupedByPost = async (): Promise<
  GroupedPostReports[]
> => {
  try {
    const response = await axios.get("/api/mongo/report/post");

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch reports by post: ${error.message}`);
    } else {
      throw new Error(
        `Failed to fetch reports by post: An unknown error occurred.`
      );
    }
  }
};

export const getReportsGroupedByComments = async (): Promise<
  GroupedCommentReports[]
> => {
  try {
    const response = await axios.get("/api/mongo/report/comment");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch reports by comment: ${error.message}`);
    } else {
      throw new Error(
        `Failed to fetch reports by comment: An unknown error occurred.`
      );
    }
  }
};

// this function gets all types of reports associated with a user, as we want to
// see ALL types of reports associated with a user, not just user reports.
export const getReportsGroupedByUser = async (): Promise<
  GroupedUserReports[]
> => {
  try {
    // todo: pass in a parameter or diff endpoint if you just want the "user report" types?
    const response = await axios.get("/api/mongo/report/user");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch reports by comment: ${error.message}`);
    } else {
      throw new Error(
        `Failed to fetch reports by comment: An unknown error occurred.`
      );
    }
  }
};
