&ldquo;use client&rdquo;;

import { useEffect, useState } from &ldquo;react&rdquo;;
import { useRouter, usePathname } from &ldquo;next/navigation&rdquo;;
import { useMockAuth } from &ldquo;@/context/mock-auth-context&rdquo;;
import { LoadingScreen } from &ldquo;@/components/ui/loading-screen&rdquo;;
import { Alert, AlertDescription } from &ldquo;@/components/ui/alert&rdquo;;
import { AlertCircle } from &ldquo;lucide-react&rdquo;;

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
      router.replace(&ldquo;/login&rdquo;);
      return;
    }

    // If user has a role, ensure they're not on role selection page
    if (user && user.role) {
      if (pathname === &ldquo;/select-role&rdquo;) {
        setIsRedirecting(true);
        router.replace(&ldquo;/dashboard&rdquo;);
        return;
      }
      // User has role and is not on role selection page, stop redirecting
      setIsRedirecting(false);
      return;
    }

    // If user exists but has no role
    if (user && !user.role) {
      // Only redirect to role selection if not already there
      if (pathname !== &ldquo;/select-role&rdquo;) {
        setIsRedirecting(true);
        router.replace(&ldquo;/select-role&rdquo;);
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
      <div className=&ldquo;min-h-screen flex items-center justify-center p-4&rdquo;>
        <Alert variant=&ldquo;destructive&rdquo; className=&ldquo;max-w-md&rdquo;>
          <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
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
  if (user.role && pathname === &ldquo;/select-role&rdquo;) {
    return <LoadingScreen />;
  }

  // If user has no role and not on role selection page (should be redirecting to role selection)
  if (!user.role && pathname !== &ldquo;/select-role&rdquo;) {
    return <LoadingScreen />;
  }

  // All checks passed, show the protected content
  return <>{children}</>;
}
