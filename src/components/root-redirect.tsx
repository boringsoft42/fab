"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockAuth } from "@/context/mock-auth-context";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function RootRedirect() {
  const { user, isLoading } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is logged in
        if (user.role) {
          // User has a role, go to dashboard
          router.replace("/dashboard");
        } else {
          // User doesn't have a role, go to role selection
          router.replace("/select-role");
        }
      } else {
        // User is not logged in, go to login
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  // Show loading screen while determining where to redirect
  return <LoadingScreen />;
}
