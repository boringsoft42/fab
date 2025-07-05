import { NextResponse } from &ldquo;next/server&rdquo;;
import type { NextRequest } from &ldquo;next/server&rdquo;;

export async function GET(request: NextRequest) {
  // Mock auth callback - just redirect to dashboard
  // In a real app, this would handle the OAuth callback
  return NextResponse.redirect(new URL(&ldquo;/dashboard&rdquo;, request.url));
}
