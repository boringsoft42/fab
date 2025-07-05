import { NextResponse } from &ldquo;next/server&rdquo;;
import type { NextRequest } from &ldquo;next/server&rdquo;;

export async function middleware(req: NextRequest) {
  // For now, just pass through all requests since we're using mock auth
  // The RoleGuard component handles authentication and redirects on the client side
  return NextResponse.next();
}

export const config = {
  matcher: [&ldquo;/dashboard/:path*&rdquo;, &ldquo;/sign-in&rdquo;, &ldquo;/sign-up&rdquo;, &ldquo;/auth/callback&rdquo;],
};
