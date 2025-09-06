import { NextResponse } from "next/server";
import { getAllReportsCount } from "./controller";
import { verifySessionCookie } from "@/lib/verifySession";
import { isValidReportCategory, isValidSchool } from "@/lib/util/backend";
import { UserRole } from "@freebites/freebites-types";

export async function GET(req: Request) {
  try {
    const { adminSchool, role } = await verifySessionCookie();

    const { searchParams } = new URL(req.url);

    const category_string = searchParams.get("category");
    const category = isValidReportCategory(category_string)
      ? category_string
      : undefined;

    const school_string = searchParams.get("school");
    const school_filter = isValidSchool(school_string)
      ? school_string
      : undefined;

    // if user is a full admin, use their selected school
    const reportCountByCategory =
      role === UserRole.ADMIN
        ? await getAllReportsCount(category, school_filter)
        : await getAllReportsCount(category, adminSchool);
    return NextResponse.json(reportCountByCategory);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get report: ${error}` },
      { status: 500 }
    );
  }
}
