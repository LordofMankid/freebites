import { NextResponse } from "next/server";
import {
  getAllReports,
  getReportById,
  putReportController,
} from "./controller";
import { verifySessionCookie } from "@/lib/verifySession";
import { isValidReportCategory } from "@/lib/util/backend";
import { ReportType } from "@freebites/freebites-types";

export async function GET(req: Request) {
  try {
    await verifySessionCookie();

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const category_string = searchParams.get("category");
    const category = isValidReportCategory(category_string)
      ? category_string
      : undefined;

    if (id) {
      const post = await getReportById(id);
      return NextResponse.json(post);
    } else {
      const posts = await getAllReports(category);
      return NextResponse.json(posts);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get report: ${error}` },
      { status: 500 }
    );
  }
}

// for replacing an entire comment. for partial updates(most cases), use PATCH in [id]
export async function PUT(req: Request) {
  try {
    const reportData: ReportType = await req.json();
    const updatedReport = await putReportController(reportData);
    return NextResponse.json(updatedReport);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update post: ${error}` },
      { status: 500 }
    );
  }
}
