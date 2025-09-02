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
