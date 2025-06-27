import { db } from "@/firebase";
import { FeedbackFormData } from "@/lib/util/types";
import { addDoc, collection } from "firebase/firestore";
import { Resend } from "resend";
import { env } from "process";

export const postFeedback = async (feedback: FeedbackFormData) => {
  console.log(feedback);
  try {
    const response = await addDoc(collection(db, "feedback"), feedback);
    if (response) {
      const resend = new Resend(env.RESEND_API_KEY);
      resend.emails.send({
        from: "onboarding@resend.dev",
        to: "freebites7@gmail.com",
        subject: "Someone Submitted a Feedback Form!",
        html: `<p>
                Somebody submitted some feedback using the form on our website! :)) <br />
                <strong>Name: </strong> ${feedback.name} <br />
                <strong>School: </strong> ${feedback.school} <br />
                <strong>Note: </strong> ${feedback.note} <br />
                <strong>Timestamp: </strong> ${feedback.date}
              </p>`,
      });
    }
    return response;
  } catch (error) {
    throw new Error("failed to post feedback: " + error);
  }
};
