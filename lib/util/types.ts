import {
  Comment,
  PostType,
  ReportType,
  UserType,
} from "@freebites/freebites-types";

export interface FeedbackFormData {
  name: string | null;
  email: string | null;
  message: string | null;
  date: Date | null;
}

export const emptyFeedback: FeedbackFormData = {
  name: null,
  email: null,
  message: null,
  date: null,
};

export interface LoginData {
  email?: string;
  username?: string;
  password?: string;
}

export const emptyLoginData: LoginData = {
  email: "",
  username: "",
  password: "",
};

export enum AdminViewType {
  POST_REPORTS = "Posts",
  USER_REPORTS = "Users",
  COMMENT_REPORTS = "Comments",
  POSTS = "All Posts",
}

// for use in group fetches for the same person when you don't need to fetch them every time
export type ReportWithReportedByUser = Omit<ReportType, "reportedByID"> & {
  reportedBy: UserType;
};

// for use when you do want to fetch the defendent, e.g. looking at a singular report
export type ReportWithUsers = Omit<
  ReportType,
  "defendentID" | "reportedByID"
> & {
  defendant: UserType;
  reportedBy: UserType;
};

export interface GroupedPostReports {
  postInfo: PostType;
  defendent: UserType; // fetch poster from the post
  reportsWithUsers: ReportWithReportedByUser[];
}

export interface GroupedCommentReports {
  commentInfo: Comment;
  defendent: UserType; // fetch poster from the post
  reportsWithUsers: ReportWithReportedByUser[];
}

// NOTE: doesn't contain full details, will instead pull individually (expand details) to avoid excessive joins
export interface GroupedUserReports {
  reportedUser: UserType;
  reportsWithUsers: ReportWithReportedByUser[];
}
