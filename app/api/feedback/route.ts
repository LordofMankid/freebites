import { FeedbackFormData } from "@/lib/util/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const feedback: FeedbackFormData = body.params;
    console.log(feedback);
    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to create feedback: " + error },
      { status: 500 }
    );
  }
}
