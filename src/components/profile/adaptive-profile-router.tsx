"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type {
  Profile,
  YouthProfile,
  AdolescentProfile,
  CompanyProfile,
  InstitutionProfile,
} from "@/types/profile";

// Import role-specific profile components
import { YouthAdolescentProfile } from "./role-specific/youth-adolescent-profile";
import { CompanyProfile as CompanyProfileComponent } from "./role-specific/company-profile";
import { InstitutionalProfile } from "./role-specific/institutional-profile";
import { SuperAdminProfile } from "./role-specific/super-admin-profile";

export function AdaptiveProfileRouter() {
  const { profile, isLoading, error } = useCurrentUser();

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
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
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No se pudo cargar la información del perfil. Por favor, inicia sesión
          nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  // Route to appropriate profile form based on user role
  switch (profile.role) {
    case "SUPERADMIN":
      return <SuperAdminProfile profile={profile} />;

    case "YOUTH":
    case "ADOLESCENTS":
      return (
        <YouthAdolescentProfile
          userRole={profile.role}
          profile={profile as YouthProfile | AdolescentProfile}
        />
      );

    case "COMPANIES":
      return <CompanyProfileComponent profile={profile as CompanyProfile} />;

    case "MUNICIPAL_GOVERNMENTS":
    case "TRAINING_CENTERS":
    case "NGOS_AND_FOUNDATIONS":
      return (
        <InstitutionalProfile
          userRole={profile.role}
          profile={profile as InstitutionProfile}
        />
      );

    default:
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Tipo de usuario no reconocido. Contacta al soporte técnico.
          </AlertDescription>
        </Alert>
      );
  }
}
