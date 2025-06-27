import axios from "axios";
import { FeedbackFormData } from "../util/types";

export const createFeedback = async (data: FeedbackFormData) => {
  const updatedData = { ...data, date: new Date(Date.now()) };
  const response = await axios.post("/api/feedback", updatedData);
  return response.data;
};
