&ldquo;use client&rdquo;;

import { useCurrentUser } from &ldquo;@/hooks/use-current-user&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Alert, AlertDescription } from &ldquo;@/components/ui/alert&rdquo;;
import { AlertCircle } from &ldquo;lucide-react&rdquo;;

// Import role-specific dashboard components
import { DashboardYouth } from &ldquo;./role-specific/dashboard-youth&rdquo;;
import { DashboardAdolescent } from &ldquo;./role-specific/dashboard-adolescent&rdquo;;
import { DashboardCompany } from &ldquo;./role-specific/dashboard-company&rdquo;;
import { DashboardMunicipio } from &ldquo;./dashboard-municipio&rdquo;;

// Placeholder components for other roles (to be implemented later)
function DashboardMunicipalGovernment() {
  return (
    <DashboardMunicipio/>
  );
}

function DashboardTrainingCenter() {
  return (
    <div className=&ldquo;space-y-6&rdquo;>
      <div>
        <h1 className=&ldquo;text-3xl font-bold tracking-tight&rdquo;>
          Dashboard Educativo
        </h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Panel de centro de capacitación - En desarrollo
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Panel en Construcción</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El dashboard para centros de capacitación está en desarrollo.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardNGO() {
  return (
    <div className=&ldquo;space-y-6&rdquo;>
      <div>
        <h1 className=&ldquo;text-3xl font-bold tracking-tight&rdquo;>Dashboard Social</h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Panel de ONG/Fundación - En desarrollo
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Panel en Construcción</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El dashboard para ONGs y fundaciones está en desarrollo.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdaptiveDashboard() {
  const { profile, isLoading, error } = useCurrentUser();

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className=&ldquo;space-y-6&rdquo;>
        <div className=&ldquo;space-y-2&rdquo;>
          <Skeleton className=&ldquo;h-8 w-64&rdquo; />
          <Skeleton className=&ldquo;h-4 w-96&rdquo; />
        </div>

        <div className=&ldquo;grid gap-4 md:grid-cols-2 lg:grid-cols-4&rdquo;>
          <Skeleton className=&ldquo;h-32&rdquo; />
          <Skeleton className=&ldquo;h-32&rdquo; />
          <Skeleton className=&ldquo;h-32&rdquo; />
          <Skeleton className=&ldquo;h-32&rdquo; />
        </div>

        <div className=&ldquo;grid gap-6 md:grid-cols-2&rdquo;>
          <Skeleton className=&ldquo;h-80&rdquo; />
          <Skeleton className=&ldquo;h-80&rdquo; />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className=&ldquo;space-y-6&rdquo;>
        <Alert variant=&ldquo;destructive&rdquo;>
          <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
          <AlertDescription>
            Error al cargar el dashboard: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show fallback if no profile
  if (!profile) {
    return (
      <div className=&ldquo;space-y-6&rdquo;>
        <Alert>
          <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
          <AlertDescription>
            No se pudo cargar la información del perfil. Por favor, inicia
            sesión nuevamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (profile.role) {
    case &ldquo;YOUTH&rdquo;:
      return <DashboardYouth />;

    case &ldquo;ADOLESCENTS&rdquo;:
      return <DashboardAdolescent />;

    case &ldquo;COMPANIES&rdquo;:
      return <DashboardCompany />;

    case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
      return <DashboardMunicipalGovernment />;

    case &ldquo;TRAINING_CENTERS&rdquo;:
      return <DashboardTrainingCenter />;

    case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
      return <DashboardNGO />;

    default:
      // Fallback to Youth dashboard for unknown roles
      return <DashboardYouth />;
  }
}
