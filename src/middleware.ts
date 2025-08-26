import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Get token from cookies or headers
  const token = req.cookies.get("token")?.value || 
                req.headers.get("authorization")?.replace("Bearer ", "");

  console.log("🔒 Middleware - Path:", pathname, "Token exists:", !!token);

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Define auth routes that should redirect away if already authenticated
  const authRoutes = ["/login", "/register", "/sign-in", "/sign-up"];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If user is trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    console.log("🔒 Middleware - Redirecting to login (no token for protected route)");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is trying to access auth routes while already authenticated
  if (isAuthRoute && token) {
    console.log("🔒 Middleware - Redirecting to dashboard (authenticated user on auth route)");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/login", 
    "/register", 
    "/sign-in", 
    "/sign-up", 
    "/auth/callback",
    // Add admin routes
    "/admin/:path*",
    // Add other role-specific routes
    "/companies/:path*",
    "/municipalities/:path*",
    "/institutions/:path*"
  ],
};
