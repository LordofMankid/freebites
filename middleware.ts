import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAPI = pathname.startsWith("/api");
  const token = request.cookies.get("auth-token")?.value;

  if (isAPI && !token) {
    return new NextResponse("Access denied", { status: 403 });
  }
  // useful for getting header info on server side components
  const headers = new Headers(request.headers);
  headers.set("x-current-path", pathname);
  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/admin/:path*", "/api/mongo/:path*"],
};
