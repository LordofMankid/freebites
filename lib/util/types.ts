import {
  Comment,
  PostType,
  ReportType,
  UserType,
} from "@freebites/freebites-types";

export interface ContactFormData {
  name: string | null;
  email: string | null;
  message: string | null;
  date: Date | null;
}

export const emptyContact: ContactFormData = {
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

// get the full firebase URL
export interface PostTypeWithImageURL extends PostType {
  imageURL?: string | null;
}

export interface UserTypeWithImageURL extends UserType {
  profileURL?: string | null;
}

// for use in group fetches for the same person when you don't need to fetch them every time
export type ReportWithReportedByUser = Omit<ReportType, "reportedByID"> & {
  reportedBy: UserTypeWithImageURL | null;
};

// for use when you do want to fetch the defendent, e.g. looking at a singular report
export type ReportWithUsers = Omit<
  ReportType,
  "defendentID" | "reportedByID"
> & {
  defendant: UserTypeWithImageURL;
  reportedBy: UserTypeWithImageURL;
};

export interface GroupedPostReports {
  postInfo: PostTypeWithImageURL | null;
  defendent: UserTypeWithImageURL | null; // fetch poster from the post
  reportsWithUsers: ReportWithReportedByUser[];
}

export interface GroupedCommentReports {
  commentInfo: Comment;
  defendent: UserTypeWithImageURL | null; // fetch poster from the post
  reportsWithUsers: ReportWithReportedByUser[];
}

// NOTE: doesn't contain full details, will instead pull individually (expand details) to avoid excessive joins
export interface GroupedUserReports {
  reportedUser: UserTypeWithImageURL | null;
  reportsWithUsers: ReportWithReportedByUser[];
}
