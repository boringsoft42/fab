&ldquo;use client&rdquo;;

import { useEffect } from &ldquo;react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { useMockAuth } from &ldquo;@/context/mock-auth-context&rdquo;;
import { LoadingScreen } from &ldquo;@/components/ui/loading-screen&rdquo;;

export function RootRedirect() {
  const { user, isLoading } = useMockAuth();
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Usuario autenticado
        if (user.role) {
          router.replace(&ldquo;/dashboard&rdquo;);
        } else {
          router.replace(&ldquo;/select-role&rdquo;);
        }
      } else {
        // Usuario NO autenticado → redirigir a landing
        router.replace(&ldquo;/landing&rdquo;);
      }
    }
  }, [user, isLoading, router]);

  return <LoadingScreen />;
}
