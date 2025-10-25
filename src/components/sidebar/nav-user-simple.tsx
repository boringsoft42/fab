"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function NavUserSimple() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 justify-start"
          onClick={() => router.push("/profile")}
        >
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">Mi Perfil</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
