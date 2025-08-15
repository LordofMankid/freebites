import { ReportType } from "@freebites/freebites-types";
import { patchReportController } from "./controller";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const reportId = (await params).id;
    const updates: Partial<ReportType> = await req.json();

    const updatedReport = await patchReportController(reportId, updates);
    return NextResponse.json(updatedReport);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update report: ${error}` },
      { status: 500 }
    );
  }
}
