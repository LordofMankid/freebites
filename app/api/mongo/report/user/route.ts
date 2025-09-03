import { NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/verifySession";
import { GroupedUserReports } from "@/lib/util/types";
import { getAllReportsOnUsers } from "./controller";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  try {
    await verifySessionCookie();

    // save this for filtered searches later

    // todo: add school filter in backend here
    // const { searchParams } = new URL(req.url);

    const groupedPostReports: GroupedUserReports[] =
      await getAllReportsOnUsers();

    return NextResponse.json(groupedPostReports);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Failed to get post reports: ${error}` },
      { status: 500 }
    );
  }
}
