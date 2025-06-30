"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Import role-specific dashboard components
import { DashboardYouth } from "./role-specific/dashboard-youth";
import { DashboardAdolescent } from "./role-specific/dashboard-adolescent";
import { DashboardCompany } from "./role-specific/dashboard-company";

// Placeholder components for other roles (to be implemented later)
function DashboardMunicipalGovernment() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Administrativo
        </h1>
        <p className="text-muted-foreground">
          Panel de administración municipal - En desarrollo
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Panel en Construcción</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El dashboard para gobiernos municipales está en desarrollo.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardTrainingCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Educativo
        </h1>
        <p className="text-muted-foreground">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Social</h1>
        <p className="text-muted-foreground">
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
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
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
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
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
    case "YOUTH":
      return <DashboardYouth />;

    case "ADOLESCENTS":
      return <DashboardAdolescent />;

    case "COMPANIES":
      return <DashboardCompany />;

    case "MUNICIPAL_GOVERNMENTS":
      return <DashboardMunicipalGovernment />;

    case "TRAINING_CENTERS":
      return <DashboardTrainingCenter />;

    case "NGOS_AND_FOUNDATIONS":
      return <DashboardNGO />;

    default:
      // Fallback to Youth dashboard for unknown roles
      return <DashboardYouth />;
  }
}
