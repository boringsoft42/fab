import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Mock auth callback - just redirect to dashboard
  // In a real app, this would handle the OAuth callback
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
