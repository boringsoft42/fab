import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getDefaultDashboardRoute } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Create user profile in Prisma if it doesn't exist and we have a session
    if (data?.session) {
      const userId = data.session.user.id;
      const userEmail = data.session.user.email;

      try {
        const existingProfile = await prisma.profile.findUnique({
          where: { userId },
        });

        if (!existingProfile) {
          // Create new profile with default YOUTH role
          await prisma.profile.create({
            data: {
              userId,
              email: userEmail,
              role: UserRole.YOUTH, // Default role for new users
              profileCompletion: 10, // Basic completion for having email
            },
          });

          // Redirect to profile completion for new users
          return NextResponse.redirect(
            new URL("/profile/complete", request.url)
          );
        } else {
          // Update last login for existing users
          await prisma.profile.update({
            where: { userId },
            data: {
              lastLoginAt: new Date(),
            },
          });

          // Redirect to role-appropriate dashboard
          const dashboardRoute = getDefaultDashboardRoute(existingProfile.role);
          return NextResponse.redirect(new URL(dashboardRoute, request.url));
        }
      } catch (error) {
        console.error("Error managing user profile:", error);
        // Fallback to default dashboard on error
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
