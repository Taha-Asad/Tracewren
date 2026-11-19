import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public workspace registration route without an existing session
  if (pathname === "/workspace/new" || pathname.startsWith("/workspace/new/")) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("caulvyn_session")?.value;
  if (!sessionToken || sessionToken.trim().length === 0) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace", "/workspace/:path*", "/onboarding", "/onboarding/:path*"],
};
