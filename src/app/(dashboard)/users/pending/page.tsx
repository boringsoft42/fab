import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PendingUsersTable } from "@/components/users/pending-users-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PendingUsersPage() {
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

  // Fetch pending users with their profile data
  // We need to join users with atletas/entrenadores/jueces and asociaciones
  const { data: pendingUsers, error } = await supabase
    .from("users")
    .select(`
      user_id,
      rol,
      estado,
      created_at,
      asociaciones:asociacion_id (
        nombre
      )
    `)
    .eq("estado", "pendiente")
    .in("rol", ["atleta", "entrenador", "juez"])
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending users:", error)
  }

  // Fetch profile data for each pending user
  const enrichedUsers = await Promise.all(
    (pendingUsers || []).map(async (user) => {
      let profileData = null

      // Determine which profile table to query
      const profileTable = user.rol === "atleta" ? "atletas"
        : user.rol === "entrenador" ? "entrenadores"
        : user.rol === "juez" ? "jueces"
        : null

      if (profileTable) {
        const { data } = await supabase
          .from(profileTable)
          .select("nombre, apellido, email, ci, fecha_registro")
          .eq("user_id", user.user_id)
          .single()

        profileData = data
      }

      return {
        user_id: user.user_id,
        rol: user.rol,
        asociacion_nombre: user.asociaciones?.nombre || "N/A",
        fecha_registro: profileData?.fecha_registro || user.created_at || new Date().toISOString(),
        nombre: profileData?.nombre || "N/A",
        apellido: profileData?.apellido || "",
        email: profileData?.email || "N/A",
        ci: profileData?.ci || "N/A",
      }
    })
  )

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Usuarios Pendientes de Aprobación</h2>
        <p className="text-muted-foreground">
          Revisa y aprueba o rechaza las solicitudes de registro público
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes ({enrichedUsers.length})</CardTitle>
          <CardDescription>
            Usuarios que se han registrado públicamente y están esperando tu aprobación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PendingUsersTable data={enrichedUsers} />
        </CardContent>
      </Card>
    </div>
  )
}
