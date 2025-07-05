&ldquo;use client&rdquo;;

import { useCurrentUser } from &ldquo;@/hooks/use-current-user&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { Alert, AlertDescription } from &ldquo;@/components/ui/alert&rdquo;;
import { AlertCircle } from &ldquo;lucide-react&rdquo;;

// Import role-specific profile components (will create these next)
import { YouthAdolescentProfile } from &ldquo;./role-specific/youth-adolescent-profile&rdquo;;
import { CompanyProfile } from &ldquo;./role-specific/company-profile&rdquo;;
import { InstitutionalProfile } from &ldquo;./role-specific/institutional-profile&rdquo;;

export function AdaptiveProfileRouter() {
  const { profile, isLoading, error } = useCurrentUser();

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className=&ldquo;space-y-6&rdquo;>
        <div className=&ldquo;space-y-2&rdquo;>
          <Skeleton className=&ldquo;h-8 w-64&rdquo; />
          <Skeleton className=&ldquo;h-4 w-96&rdquo; />
        </div>
        <div className=&ldquo;grid gap-6 md:grid-cols-2&rdquo;>
          <Skeleton className=&ldquo;h-96&rdquo; />
          <Skeleton className=&ldquo;h-96&rdquo; />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant=&ldquo;destructive&rdquo;>
        <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
        <AlertDescription>
          Error al cargar el perfil: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Show fallback if no profile
  if (!profile) {
    return (
      <Alert>
        <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
        <AlertDescription>
          No se pudo cargar la información del perfil. Por favor, inicia sesión
          nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  // Route to appropriate profile form based on user role
  switch (profile.role) {
    case &ldquo;YOUTH&rdquo;:
    case &ldquo;ADOLESCENTS&rdquo;:
      return (
        <YouthAdolescentProfile userRole={profile.role} profile={profile} />
      );

    case &ldquo;COMPANIES&rdquo;:
      return <CompanyProfile profile={profile} />;

    case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
    case &ldquo;TRAINING_CENTERS&rdquo;:
    case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
      return <InstitutionalProfile userRole={profile.role} profile={profile} />;

    default:
      return (
        <Alert>
          <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
          <AlertDescription>
            Tipo de usuario no reconocido. Contacta al soporte técnico.
          </AlertDescription>
        </Alert>
      );
  }
}
