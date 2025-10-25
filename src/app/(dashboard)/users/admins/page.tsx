import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminAsociacionTable } from "@/components/users/admin-asociacion-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminAsociacionPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in")
  }

  // Verify admin_fab role
  const { data: user } = await supabase
    .from("users")
    .select("rol")
    .eq("user_id", session.user.id)
    .single()

  if (!user || user.rol !== "admin_fab") {
    redirect("/dashboard")
  }

  // Fetch all admin_asociacion users
  const { data: admins, error } = await supabase
    .from("users")
    .select(`
      user_id,
      estado,
      created_at,
      asociaciones:asociacion_id (
        nombre
      )
    `)
    .eq("rol", "admin_asociacion")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching admin_asociacion users:", error)
  }

  // Get email from Supabase Auth for each admin
  const enrichedAdmins = await Promise.all(
    (admins || []).map(async (admin) => {
      const { data: authUser } = await supabase.auth.admin.getUserById(admin.user_id)

      return {
        user_id: admin.user_id,
        email: authUser.user?.email || "N/A",
        estado: admin.estado,
        asociacion_nombre: admin.asociaciones?.nombre || "N/A",
        created_at: admin.created_at || new Date().toISOString(),
      }
    })
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Administradores de Asociación</h2>
          <p className="text-muted-foreground">
            Gestiona los administradores de las 9 asociaciones departamentales
          </p>
        </div>
        <Link href="/users/admins/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Administrador
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administradores ({enrichedAdmins.length})</CardTitle>
          <CardDescription>
            Lista de todos los administradores de asociación en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminAsociacionTable data={enrichedAdmins} />
        </CardContent>
      </Card>
    </div>
  )
}
