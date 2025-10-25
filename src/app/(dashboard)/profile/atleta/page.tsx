import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { AtletaForm } from "@/components/profile/atleta-form"

/**
 * Atleta Profile Creation Page
 * Task 3.5.1, REQ-2.1.x
 *
 * Only accessible to users with rol="atleta" who don't have a profile yet
 */

export default async function AtletaProfilePage() {
  const supabase = await createServerClient()

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/sign-in")
  }

  // 2. Get user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_id, rol, asociacion_id")
    .eq("user_id", user.id)
    .single()

  if (userError || !userData) {
    redirect("/sign-in")
  }

  // 3. Verify rol is atleta
  if (userData.rol !== "atleta") {
    redirect("/dashboard")
  }

  // 4. Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("atletas")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (existingProfile) {
    // Profile exists, redirect to "Mi Perfil" page
    redirect("/profile")
  }

  // 5. Fetch all asociaciones for dropdown
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
        <h1 className="text-3xl font-bold tracking-tight">Crear Perfil de Atleta</h1>
        <p className="text-muted-foreground mt-2">
          Completa todos los pasos para crear tu perfil. Tu información será
          revisada por la administración de FAB antes de ser aprobada.
        </p>
      </div>

      <AtletaForm userId={user.id} asociaciones={asociaciones} />
    </div>
  )
}
