import { Suspense } from "react";
import { Users, UserCheck, Calendar, CreditCard, Award, Building2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardSkeleton, StatsCardSkeleton, CardSkeleton } from "@/components/ui/skeleton-loader";
import {
  getDashboardMetrics,
  getRecentUsers,
  getPendingPayments,
  getUpcomingEvents,
} from "@/lib/actions/dashboard/admin-fab-actions";
import { RecentUsersTable } from "@/components/dashboard/recent-users-table";
import { PendingPaymentsTable } from "@/components/dashboard/pending-payments-table";
import { UpcomingEventsList } from "@/components/dashboard/upcoming-events-list";

/**
 * Admin FAB Dashboard - Main Component
 *
 * This is the main dashboard for admin_fab users. It displays:
 * - Key metrics (users, payments, events)
 * - Recent users registered
 * - Pending payments
 * - Upcoming events
 * - Quick actions for common tasks
 */

async function DashboardMetrics() {
  const metrics = await getDashboardMetrics();

  return (
    <>
      {/* Primary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Usuarios"
          value={metrics.totalUsers}
          description={`Atletas: ${metrics.usersByRol.atleta} | Entrenadores: ${metrics.usersByRol.entrenador} | Jueces: ${metrics.usersByRol.juez}`}
          icon={Users}
          iconClassName="text-blue-600"
        />
        <StatsCard
          title="Usuarios Pendientes"
          value={metrics.pendingUsers.total}
          description={`Atletas: ${metrics.pendingUsers.atletas} | Entrenadores: ${metrics.pendingUsers.entrenadores} | Jueces: ${metrics.pendingUsers.jueces}`}
          icon={UserCheck}
          iconClassName="text-yellow-600"
        />
        <StatsCard
          title="Pagos Pendientes"
          value={metrics.pendingPayments.total}
          description={`Total: Bs ${metrics.pendingPayments.totalAmount.toLocaleString("es-BO", { minimumFractionDigits: 2 })}`}
          icon={CreditCard}
          iconClassName="text-orange-600"
        />
        <StatsCard
          title="Eventos Activos"
          value={metrics.activeEvents.total}
          description={`Federativos: ${metrics.activeEvents.federativo} | Asociación: ${metrics.activeEvents.asociacion}`}
          icon={Calendar}
          iconClassName="text-purple-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Admin Asociaciones"
          value={metrics.adminAsociaciones.total}
          description={`Activos: ${metrics.adminAsociaciones.activos} | Inactivos: ${metrics.adminAsociaciones.inactivos}`}
          icon={Award}
          iconClassName="text-indigo-600"
        />
        <StatsCard
          title="Asociaciones Registradas"
          value={metrics.usersByRol.admin_asociacion}
          description="Total de asociaciones con administradores"
          icon={Building2}
          iconClassName="text-cyan-600"
        />
      </div>
    </>
  );
}

async function RecentActivity() {
  const [recentUsers, pendingPayments, upcomingEvents] = await Promise.all([
    getRecentUsers(),
    getPendingPayments(),
    getUpcomingEvents(),
  ]);

  return (
    <>
      {/* Recent Users */}
      <RecentUsersTable users={recentUsers} />

      {/* Pending Payments */}
      <PendingPaymentsTable payments={pendingPayments} />

      {/* Upcoming Events */}
      <UpcomingEventsList events={upcomingEvents} />
    </>
  );
}

function QuickActions({ pendingUsersCount, pendingPaymentsCount }: { pendingUsersCount: number; pendingPaymentsCount: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Acciones comunes para administradores FAB</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href="/dashboard/users/pending" className="block">
          <Button variant="outline" className="w-full justify-start">
            <UserCheck className="mr-2 h-4 w-4" />
            Revisar usuarios pendientes ({pendingUsersCount})
          </Button>
        </Link>
        <Link href="/dashboard/pagos/pending" className="block">
          <Button variant="outline" className="w-full justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Verificar pagos ({pendingPaymentsCount})
          </Button>
        </Link>
        <Link href="/dashboard/users/admins" className="block">
          <Button variant="outline" className="w-full justify-start">
            <Award className="mr-2 h-4 w-4" />
            Gestionar administradores
          </Button>
        </Link>
        <Link href="/dashboard/events" className="block">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Ver todos los eventos
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export async function AdminFabDashboard() {
  // Fetch metrics for quick actions
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin FAB</h2>
        <p className="text-muted-foreground">Vista general del sistema de gestión</p>
      </div>

      {/* Metrics */}
      <Suspense
        fallback={
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
          </>
        }
      >
        <DashboardMetrics />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions pendingUsersCount={metrics.pendingUsers.total} pendingPaymentsCount={metrics.pendingPayments.total} />

      {/* Recent Activity Tables */}
      <Suspense
        fallback={
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        }
      >
        <RecentActivity />
      </Suspense>
    </div>
  );
}
