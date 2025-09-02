import { NextResponse } from "next/server";
import { getAllReportsCount } from "./controller";
import { verifySessionCookie } from "@/lib/verifySession";
import { isValidReportCategory } from "@/lib/util/backend";

export async function GET(req: Request) {
  try {
    await verifySessionCookie();

    const { searchParams } = new URL(req.url);

    const category_string = searchParams.get("category");
    const category = isValidReportCategory(category_string)
      ? category_string
      : undefined;

    const reportCountByCategory = await getAllReportsCount(category);
    return NextResponse.json(reportCountByCategory);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get report: ${error}` },
      { status: 500 }
    );
  }
}
