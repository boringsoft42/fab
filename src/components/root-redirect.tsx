"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockAuth } from "@/context/mock-auth-context";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function RootRedirect() {
  const router = useRouter();
  const { user, isLoading } = useMockAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isLoading) {
        if (user) {
          // Usuario autenticado
          if (user.role) {
            await router.replace("/dashboard");
          } else {
            await router.replace("/select-role");
          }
        } else {
          // Usuario NO autenticado → redirigir a landing
          await router.replace("/landing");
        }
      }
    };

    handleRedirect();
  }, [user, isLoading, router]);

  return <LoadingScreen />;
}
