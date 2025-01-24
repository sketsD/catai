import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("auth-token");

  // Protect all routes under /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Prevent authenticated users from accessing auth pages
  if (
    isAuthenticated &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/restore-password" ||
      request.nextUrl.pathname.startsWith("/restore-password/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/restore-password/:path*"],
};
