'use client';

import { useAuth } from &ldquo;@/providers/auth-provider&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { LogOut } from &ldquo;lucide-react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className=&ldquo;border-b border-border&rdquo;>
      <div className=&ldquo;container mx-auto px-4 py-4&rdquo;>
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <div>
            <h2 className=&ldquo;text-lg font-medium&rdquo;>Welcome, {user?.email}</h2>
          </div>
          <Button
            variant=&ldquo;outline&rdquo;
            onClick={handleSignOut}
            className=&ldquo;flex items-center gap-2&rdquo;
          >
            <LogOut className=&ldquo;h-4 w-4&rdquo; />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
} 