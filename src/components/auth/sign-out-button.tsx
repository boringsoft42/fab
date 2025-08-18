'use client';

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/use-auth";

export function SignOutButton() {
  const { signOut } = useAuthContext();

  return (
    <Button variant="outline" onClick={signOut}>
      Sign Out
    </Button>
  );
} 