"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMockAuth } from "@/context/mock-auth-context";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
}

export function RoleGuard({ children }: RoleGuardProps) {
  const { user, isLoading, error } = useMockAuth();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Don't do anything while loading or already redirecting
    if (isLoading || isRedirecting) return;

    // If no user, redirect to login
    if (!user) {
      setIsRedirecting(true);
      router.replace("/login");
      return;
    }

    // If user has a role, ensure they're not on role selection page
    if (user && user.role) {
      if (pathname === "/select-role") {
        setIsRedirecting(true);
        router.replace("/dashboard");
        return;
      }
      // User has role and is not on role selection page, stop redirecting
      setIsRedirecting(false);
      return;
    }

    // If user exists but has no role
    if (user && !user.role) {
      // Only redirect to role selection if not already there
      if (pathname !== "/select-role") {
        setIsRedirecting(true);
        router.replace("/select-role");
        return;
      }
      // If already on role selection page, stop redirecting
      setIsRedirecting(false);
      return;
    }

    // If we reach here, everything is fine, stop redirecting
    setIsRedirecting(false);
  }, [user, isLoading, router, pathname, isRedirecting]);

  // Show loading screen while checking user or redirecting
  if (isLoading || isRedirecting) {
    return <LoadingScreen />;
  }

  // Show error if failed to load user
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al verificar el usuario: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no user (should be redirecting to login)
  if (!user) {
    return <LoadingScreen />;
  }

  // If user has role but is on role selection page (should be redirecting to dashboard)
  if (user.role && pathname === "/select-role") {
    return <LoadingScreen />;
  }

  // If user has no role and not on role selection page (should be redirecting to role selection)
  if (!user.role && pathname !== "/select-role") {
    return <LoadingScreen />;
  }

  // All checks passed, show the protected content
  return <>{children}</>;
}
