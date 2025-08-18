"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserColors } from "@/hooks/use-user-colors";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function AdaptiveDashboard() {
  const { profile, isLoading, error } = useCurrentUser();
  
  // Aplicar colores personalizados del municipio
  const colors = useUserColors();

  // Debug logs
    console.log("🔍 AdaptiveDashboard - Debug Info:", {
      profile,
      isLoading,
      error,
      profileRole: profile?.role,
      profileRoleType: typeof profile?.role,
      colors: {
        primaryColor: colors.primaryColor,
        secondaryColor: colors.secondaryColor
      }
    });

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

  // Show dashboard based on user role
  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido al sistema CEMSE
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No hay perfil disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No se pudo cargar tu perfil. Por favor, inicia sesión nuevamente.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get role display name
  const getRoleDisplayName = (role: string | null) => {
    if (!role) return 'Usuario';
    
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': 'Super Administrador',
      'SUPERADMIN': 'Super Administrador', // Agregado para compatibilidad
      'JOVENES': 'Jóvenes',
      'ADOLESCENTES': 'Adolescentes',
      'EMPRESAS': 'Empresas',
      'GOBIERNOS_MUNICIPALES': 'Gobiernos Municipales',
      'CENTROS_DE_FORMACION': 'Centros de Formación',
      'ONGS_Y_FUNDACIONES': 'ONGs y Fundaciones',
      'CLIENT': 'Cliente',
      'AGENT': 'Agente'
    };
    
    return roleMap[role] || role;
  };

  // Check if user role should have custom colors (only municipalities and institutions)
  const shouldUseCustomColors = profile.role === 'GOBIERNOS_MUNICIPALES' || 
                               profile.role === 'CENTROS_DE_FORMACION' || 
                               profile.role === 'ONGS_Y_FUNDACIONES';

  // Simple dashboard for now
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al sistema CEMSE - {getRoleDisplayName(profile.role)}
        </p>
       
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={shouldUseCustomColors ? { color: colors.primaryColor } : { color: '#3b82f6' }}
            >
              0
            </div>
            <p className="text-xs text-muted-foreground">
              Cursos disponibles
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleos</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={shouldUseCustomColors ? { color: colors.secondaryColor } : { color: '#f97316' }}
            >
              0
            </div>
            <p className="text-xs text-muted-foreground">
              Ofertas de trabajo
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Noticias</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={shouldUseCustomColors ? { color: colors.primaryColor } : { color: '#3b82f6' }}
            >
              0
            </div>
            <p className="text-xs text-muted-foreground">
              Artículos disponibles
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={shouldUseCustomColors ? { color: colors.secondaryColor } : { color: '#f97316' }}
            >
              {profile.completionPercentage || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Completado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle 
              className="text-lg font-semibold"
              style={shouldUseCustomColors ? { color: colors.primaryColor } : { color: '#3b82f6' }}
            >
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded bg-gray-50">
              <strong>ID:</strong> 
              <span className="font-mono text-sm">{profile.id}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-gray-50">
              <strong>Usuario:</strong> 
              <span style={shouldUseCustomColors ? { color: colors.primaryColor } : { color: '#3b82f6' }}>{profile.firstName}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-gray-50">
              <strong>Rol:</strong> 
              <span style={shouldUseCustomColors ? { color: colors.secondaryColor } : { color: '#f97316' }}>{getRoleDisplayName(profile.role)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-gray-50">
              <strong>Rol Original:</strong> 
              <span className="font-mono text-sm">"{profile.role}"</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle 
              className="text-lg font-semibold"
              style={shouldUseCustomColors ? { color: colors.secondaryColor } : { color: '#f97316' }}
            >
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-4 rounded-lg border-2 border-dashed"
              style={shouldUseCustomColors ? {
                borderColor: colors.primaryColor,
                backgroundColor: `${colors.primaryColor}08`
              } : {
                borderColor: '#3b82f6',
                backgroundColor: '#eff6ff'
              }}
            >
              <p className="text-muted-foreground text-center">
                Aquí aparecerán las acciones específicas para tu rol.
              </p>
              <div className="mt-3 text-center">
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={shouldUseCustomColors ? {
                    backgroundColor: colors.secondaryColor,
                    color: 'white'
                  } : {
                    backgroundColor: '#f97316',
                    color: 'white'
                  }}
                >
                  {shouldUseCustomColors ? 'Personalizado con colores del municipio' : 'Acciones disponibles'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
