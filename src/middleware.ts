import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // For now, just pass through all requests since we're using mock auth
  // The RoleGuard component handles authentication and redirects on the client side
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/auth/callback"],
};
