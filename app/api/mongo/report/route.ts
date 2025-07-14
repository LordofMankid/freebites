/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import {
  getAllReports,
  getReportById,
  putReportController,
} from "./controller";
import { ReportType } from "@freebites/freebites-types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("_id");

    if (id) {
      const post = await getReportById(id);
      // console.log(user);
      return NextResponse.json(post);
    } else {
      const posts = await getAllReports();
      return NextResponse.json(posts);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get post: ${error}` },
      { status: 500 }
    );
  }
}

// export async function PUT(req: Request) {
//   try {
//     const reportData: ReportType = await req.json();
//     const updatedReport = await putReportController(reportData);
//     return NextResponse.json(updatedReport);
//   } catch (error) {
//     return NextResponse.json(
//       { error: `Failed to update post: ${error}` },
//       { status: 500 }
//     );
//   }
// }
