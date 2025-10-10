'use client';

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardButtonProps {
  className?: string;
}

export default function DashboardButton({ className }: DashboardButtonProps = {}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading || !user) return null;

  return (
    <Button
      onClick={() => router.push("/dashboard")}
      className={`flex items-center gap-2 shadow-lg ${className}`}
    >
      <LayoutDashboard className="h-4 w-4" />
      Go to Dashboard
    </Button>
  );
} 