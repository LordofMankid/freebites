// /app/api/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const decoded = await verifyIdToken(token);

    const res = NextResponse.json({ success: true });

    // Set cookie (expires in 7 days, adjust as needed)
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("Token verification failed in session route", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
