import axios from "axios";
import { FeedbackFormData } from "../util/types";

export const createFeedback = async (data: FeedbackFormData) => {
  console.log(data);
  const response = await axios.post("/api/feedback", { params: data });
  return response.data;
};
