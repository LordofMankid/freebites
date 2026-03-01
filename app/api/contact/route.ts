import { ContactFormData } from "@/lib/util/types";
import { NextResponse } from "next/server";
import { postContact } from "./controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contact: ContactFormData = body;
    const response = await postContact(contact);
    return NextResponse.json({ response, message: "success", status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to send contact email: " + error },
      { status: 500 },
    );
  }
}
