'use client';

import { useAuth } from &ldquo;@/providers/auth-provider&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { LayoutDashboard } from &ldquo;lucide-react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;

interface DashboardButtonProps {
  className?: string;
}

export default function DashboardButton({ className }: DashboardButtonProps = {}) {
  const { user, isLoading } = useAuth();
  if (isLoading || !user) return null;

  return (
    <Button
      onClick={() => router.push(&ldquo;/dashboard&rdquo;)}
      className={`flex items-center gap-2 shadow-lg ${className}`}
    >
      <LayoutDashboard className=&ldquo;h-4 w-4&rdquo; />
      Go to Dashboard
    </Button>
  );
} 