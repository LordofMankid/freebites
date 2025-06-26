export interface FeedbackFormData {
  name: string | null;
  school: string | null;
  note: string | null;
}

export const emptyFeedback: FeedbackFormData = {
  name: null,
  school: null,
  note: null,
};
