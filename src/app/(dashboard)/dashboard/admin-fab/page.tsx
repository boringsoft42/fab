import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminFabDashboard } from "@/components/dashboard/admin-fab-dashboard"

export default async function AdminFabDashboardPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in")
  }

  // Verify user role
  const { data: user } = await supabase
    .from("users")
    .select("rol, estado")
    .eq("user_id", session.user.id)
    .single()

  if (!user || user.rol !== "admin_fab") {
    redirect("/dashboard")
  }

  // Fetch metrics
  // Total Users
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })

  // Pending Users
  const { count: pendingUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("estado", "pendiente")

  // Active Events
  const { count: activeEvents } = await supabase
    .from("eventos")
    .select("*", { count: "exact", head: true })
    .in("estado", ["en_revision", "aprobado"])

  // Pending Payments
  const { count: pendingPayments } = await supabase
    .from("pagos_evento_asociacion")
    .select("*", { count: "exact", head: true })
    .eq("estado", "pendiente")

  // Admin Asociaciones
  const { count: adminAsociaciones } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("rol", "admin_asociacion")
    .eq("estado", "activo")

  // Asociaciones
  const { count: asociaciones } = await supabase
    .from("asociaciones")
    .select("*", { count: "exact", head: true })
    .eq("estado", true)

  const metrics = {
    totalUsers: totalUsers || 0,
    pendingUsers: pendingUsers || 0,
    activeEvents: activeEvents || 0,
    pendingPayments: pendingPayments || 0,
    adminAsociaciones: adminAsociaciones || 0,
    asociaciones: asociaciones || 0,
  }

  return <AdminFabDashboard metrics={metrics} />
}
