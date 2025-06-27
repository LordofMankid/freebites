import { FeedbackFormData } from "@/lib/util/types";
import { NextResponse } from "next/server";
import { postFeedback } from "./controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const feedback: FeedbackFormData = body;
    // console.log(feedback);
    const response = await postFeedback(feedback);
    return NextResponse.json({ response, message: "success", status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to create feedback: " + error },
      { status: 500 }
    );
  }
}
