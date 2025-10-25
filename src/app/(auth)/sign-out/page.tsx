"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignOutPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      router.push("/sign-in");
      router.refresh();
    }
    signOut();
  }, [router, supabase]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Signing out...</p>
      </div>
    </div>
  );
}
