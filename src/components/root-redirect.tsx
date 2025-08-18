"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function RootRedirect() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuthContext();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!loading) {
        if (isAuthenticated && user) {
          // Usuario autenticado - redirigir directamente al dashboard
          await router.replace("/dashboard");
        } else {
          // Usuario NO autenticado → redirigir a landing
          await router.replace("/landing");
        }
      }
    };

    handleRedirect();
  }, [user, loading, isAuthenticated, router]);

  return <LoadingScreen />;
}
