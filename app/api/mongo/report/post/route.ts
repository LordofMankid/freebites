import { NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/verifySession";
import { getPostReports } from "./controller";
import { GroupedPostReports } from "@/lib/util/types";
import { UserRole } from "@freebites/freebites-types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  try {
    const { adminSchool, role } = await verifySessionCookie();

    // save this for filtered searches later

    // todo: add school filter in backend here
    // const { searchParams } = new URL(req.url);

    const groupedPostReports: GroupedPostReports[] =
      role === UserRole.ADMIN
        ? await getPostReports()
        : await getPostReports(adminSchool);

    return NextResponse.json(groupedPostReports);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Failed to get post reports: ${error}` },
      { status: 500 }
    );
  }
}
