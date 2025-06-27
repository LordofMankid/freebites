export interface FeedbackFormData {
  name: string | null;
  school: string | null;
  note: string | null;
  date: Date | null;
}

export const emptyFeedback: FeedbackFormData = {
  name: null,
  school: null,
  note: null,
  date: null,
};
