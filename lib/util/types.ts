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
