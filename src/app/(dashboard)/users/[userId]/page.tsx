import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserDetailView } from "@/components/users/user-detail-view"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ApproveRejectActions } from "@/components/users/approve-reject-actions"

export default async function UserDetailPage({
  params,
}: {
  params: { userId: string }
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in")
  }

  // Verify admin_fab role
  const { data: currentUser } = await supabase
    .from("users")
    .select("rol")
    .eq("user_id", session.user.id)
    .single()

  if (!currentUser || currentUser.rol !== "admin_fab") {
    redirect("/dashboard")
  }

  // Fetch user data
  const { data: userData } = await supabase
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
    .eq("user_id", params.userId)
    .single()

  if (!userData) {
    redirect("/users/pending")
  }

  // Fetch profile data based on rol
  const profileTable = userData.rol === "atleta" ? "atletas"
    : userData.rol === "entrenador" ? "entrenadores"
    : userData.rol === "juez" ? "jueces"
    : null

  if (!profileTable) {
    redirect("/users/pending")
  }

  const { data: profileData } = await supabase
    .from(profileTable)
    .select("*")
    .eq("user_id", params.userId)
    .single()

  if (!profileData) {
    redirect("/users/pending")
  }

  const userProfile = {
    user_id: userData.user_id,
    rol: userData.rol,
    estado: userData.estado,
    asociacion_nombre: userData.asociaciones?.nombre || "N/A",
    created_at: userData.created_at || new Date().toISOString(),
    ...profileData,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <Link href="/users/pending">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a usuarios pendientes
          </Button>
        </Link>

        {userData.estado === "pendiente" && (
          <ApproveRejectActions userId={params.userId} userName={`${profileData.nombre} ${profileData.apellido}`} />
        )}
      </div>

      {/* User detail view */}
      <UserDetailView user={userProfile} />
    </div>
  )
}
