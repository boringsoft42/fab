'use client';

import { useAuth } from &ldquo;@/hooks/use-auth&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { LogOut } from &ldquo;lucide-react&rdquo;;

export function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Button
      variant=&ldquo;outline&rdquo;
      onClick={() => signOut()}
      className=&ldquo;flex items-center gap-2&rdquo;
    >
      <LogOut className=&ldquo;h-4 w-4&rdquo; />
      Sign Out
    </Button>
  );
} 