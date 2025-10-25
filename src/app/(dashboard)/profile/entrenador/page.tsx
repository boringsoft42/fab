import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { EntrenadorForm } from "@/components/profile/entrenador-form"

/**
 * Entrenador Profile Creation Page
 * Task 3.6.1, REQ-2.2.x
 *
 * Only accessible to users with rol="entrenador" who don't have a profile yet
 */

export default async function EntrenadorProfilePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/sign-in")
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_id, rol, asociacion_id")
    .eq("user_id", user.id)
    .single()

  if (userError || !userData) {
    redirect("/sign-in")
  }

  if (userData.rol !== "entrenador") {
    redirect("/dashboard")
  }

  const { data: existingProfile } = await supabase
    .from("entrenadores")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (existingProfile) {
    redirect("/profile")
  }

  const { data: asociaciones, error: asociacionesError } = await supabase
    .from("asociaciones")
    .select("id, nombre")
    .eq("estado", true)
    .order("nombre", { ascending: true })

  if (asociacionesError || !asociaciones) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Error al cargar asociaciones</p>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Crear Perfil de Entrenador</h1>
        <p className="text-muted-foreground mt-2">
          Completa todos los pasos para crear tu perfil. Tu información será
          revisada por la administración de FAB antes de ser aprobada.
        </p>
      </div>

      <EntrenadorForm userId={user.id} asociaciones={asociaciones} />
    </div>
  )
}
