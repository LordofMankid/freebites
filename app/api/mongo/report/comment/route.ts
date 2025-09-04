import { NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/verifySession";
import { getCommentReports } from "./controller";
import { GroupedCommentReports } from "@/lib/util/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  try {
    const { adminSchool } = await verifySessionCookie();

    // save this for filtered searches later

    // todo: add school filter in backend here
    // const { searchParams } = new URL(req.url);

    const groupedCommentReports: GroupedCommentReports[] =
      await getCommentReports(adminSchool);

    return NextResponse.json(groupedCommentReports);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Failed to get post reports: ${error}` },
      { status: 500 }
    );
  }
}
