// app/api/test-firebase/route.ts
import { getFirebaseApp } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const app = getFirebaseApp();
    return NextResponse.json({
      success: true,
      appName: app.name,
      projectId: app.options.projectId,
    });
  } catch (error) {
    console.error("Firebase test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
