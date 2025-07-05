"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockAuth } from "@/context/mock-auth-context";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function RootRedirect() {
  const { user, isLoading } = useMockAuth();
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Usuario autenticado
        if (user.role) {
          router.replace("/dashboard");
        } else {
          router.replace("/select-role");
        }
      } else {
        // Usuario NO autenticado → redirigir a landing
        router.replace("/landing");
      }
    }
  }, [user, isLoading, router]);

  return <LoadingScreen />;
}
