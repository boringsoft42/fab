"use client"

import { Users, UserCheck, Calendar, CreditCard, Award, Building2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Admin FAB Dashboard
 * Shows real-time metrics from the database
 */

interface AdminFabDashboardProps {
  metrics: {
    totalUsers: number
    pendingUsers: number
    activeEvents: number
    pendingPayments: number
    adminAsociaciones: number
    asociaciones: number
  }
}

export function AdminFabDashboard({ metrics }: AdminFabDashboardProps) {

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin FAB</h2>
        <p className="text-muted-foreground">Vista general del sistema de gestión</p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Usuarios"
          value={metrics.totalUsers}
          description="Usuarios registrados en el sistema"
          icon={Users}
          iconClassName="text-blue-600"
        />
        <StatsCard
          title="Usuarios Pendientes"
          value={metrics.pendingUsers}
          description="Esperando aprobación"
          icon={UserCheck}
          iconClassName="text-yellow-600"
        />
        <StatsCard
          title="Pagos Pendientes"
          value={metrics.pendingPayments}
          description="Pagos por verificar"
          icon={CreditCard}
          iconClassName="text-orange-600"
        />
        <StatsCard
          title="Eventos Activos"
          value={metrics.activeEvents}
          description="Eventos en curso"
          icon={Calendar}
          iconClassName="text-purple-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Admin Asociaciones"
          value={metrics.adminAsociaciones}
          description="Administradores de asociaciones"
          icon={Award}
          iconClassName="text-indigo-600"
        />
        <StatsCard
          title="Asociaciones Registradas"
          value={metrics.asociaciones}
          description="Total de asociaciones"
          icon={Building2}
          iconClassName="text-cyan-600"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Acciones comunes para administradores FAB</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Link href="/users/pending">
            <Button variant="outline" className="w-full justify-start">
              <UserCheck className="mr-2 h-4 w-4" />
              Revisar usuarios pendientes
            </Button>
          </Link>
          <Link href="/users/admins">
            <Button variant="outline" className="w-full justify-start">
              <Award className="mr-2 h-4 w-4" />
              Gestionar administradores
            </Button>
          </Link>
          <Link href="/users/admins/new">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Crear Admin Asociación
            </Button>
          </Link>
          <Link href="/associations">
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Gestionar Asociaciones
            </Button>
          </Link>
          <Link href="/associations/new">
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Crear Asociación
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido al Sistema FAB</CardTitle>
          <CardDescription>
            Este es el panel de administración principal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">✅ Sistema Configurado</h4>
              <p className="text-sm text-muted-foreground">
                El sistema de gestión FAB está listo para usar. Puedes comenzar a:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Aprobar usuarios registrados (atletas, entrenadores, jueces)</li>
                <li>Crear administradores de asociaciones</li>
                <li>Gestionar eventos federativos y de asociación</li>
                <li>Verificar pagos de inscripciones</li>
                <li>Asignar dorsales a atletas</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">📊 Próximos Pasos</h4>
              <p className="text-sm text-muted-foreground">
                Las métricas se actualizarán automáticamente a medida que uses el sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
