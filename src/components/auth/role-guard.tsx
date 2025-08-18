"use client";

import { ReactNode } from 'react';
import { useAuthContext } from '@/hooks/use-auth';
import { UserRole } from '@/types/api';
import { Permission, hasPermission, hasAnyPermission } from '@/lib/permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  // Allow access to specific roles
  allowedRoles?: UserRole[];
  // Require specific permissions
  requiredPermissions?: Permission[];
  // Require ANY of the permissions (OR logic)
  anyPermissions?: Permission[];
  // Require ALL permissions (AND logic)
  allPermissions?: Permission[];
  // Custom fallback component
  fallback?: ReactNode;
  // Show loading while checking auth
  showLoading?: boolean;
}

export default function RoleGuard({
  children,
  allowedRoles,
  requiredPermissions,
  anyPermissions,
  allPermissions,
  fallback,
  showLoading = true,
}: RoleGuardProps) {
  const { user, loading, isAuthenticated } = useAuthContext();

  // Show loading state
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User not authenticated
  if (!isAuthenticated || !user) {
    return fallback || (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Acceso Restringido</h3>
          <p className="text-muted-foreground mb-4">
            Debes iniciar sesión para acceder a esta sección.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback || (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Acceso Denegado</h3>
          <p className="text-muted-foreground mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <Alert>
            <AlertDescription>
              Tu rol actual: <strong>{user.role}</strong>
              <br />
              Roles permitidos: <strong>{allowedRoles.join(', ')}</strong>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Check individual permissions
  if (requiredPermissions) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      hasPermission(user.role, permission)
    );

    if (!hasRequiredPermissions) {
      return fallback || (
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Permisos Insuficientes</h3>
            <p className="text-muted-foreground mb-4">
              No tienes los permisos necesarios para realizar esta acción.
            </p>
          </CardContent>
        </Card>
      );
    }
  }

  // Check ANY permissions (OR logic)
  if (anyPermissions) {
    const hasAnyRequiredPermission = hasAnyPermission(user.role, anyPermissions);

    if (!hasAnyRequiredPermission) {
      return fallback || (
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Permisos Insuficientes</h3>
            <p className="text-muted-foreground mb-4">
              No tienes ninguno de los permisos requeridos para esta acción.
            </p>
          </CardContent>
        </Card>
      );
    }
  }

  // Check ALL permissions (AND logic)
  if (allPermissions) {
    const hasAllRequiredPermissions = allPermissions.every(permission =>
      hasPermission(user.role, permission)
    );

    if (!hasAllRequiredPermissions) {
      return fallback || (
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Permisos Insuficientes</h3>
            <p className="text-muted-foreground mb-4">
              No tienes todos los permisos necesarios para esta acción.
            </p>
          </CardContent>
        </Card>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}
