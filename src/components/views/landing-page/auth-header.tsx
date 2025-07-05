'use client';

import { useAuth } from &ldquo;@/providers/auth-provider&rdquo;;
import DashboardButton from &ldquo;@/components/dashboard/dashboard-button&rdquo;;
import Link from &ldquo;next/link&rdquo;;

export function AuthHeader() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className=&ldquo;h-9 w-[100px] animate-pulse rounded-md bg-muted&rdquo; />
    );
  }

  if (user) {
    return <DashboardButton />;
  }

  return (
    <div className=&ldquo;flex items-center space-x-4&rdquo;>
      <Link
        href=&ldquo;/sign-in&rdquo;
        className=&ldquo;text-primary hover:text-primary-foreground hover:bg-primary px-4 py-2 rounded-md transition-colors&rdquo;
      >
        Sign In
      </Link>
      <Link
        href=&ldquo;/sign-up&rdquo;
        className=&ldquo;bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors&rdquo;
      >
        Sign Up
      </Link>
    </div>
  );
} 