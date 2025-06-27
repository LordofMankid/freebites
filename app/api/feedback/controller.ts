import { db } from "@/firebase";
import { FeedbackFormData } from "@/lib/util/types";
import { addDoc, collection } from "firebase/firestore";

export const postFeedback = async (feedback: FeedbackFormData) => {
  console.log(feedback);
  try {
    const response = await addDoc(collection(db, "feedback"), feedback);
    return response;
  } catch (error) {
    throw new Error("failed to post feedback: " + error);
  }
};
