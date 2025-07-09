import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // useful for getting header info on server side components

  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/admin/:path*"],
};
