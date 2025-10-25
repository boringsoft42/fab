import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreateAdminForm } from "@/components/users/create-admin-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewAdminAsociacionPage() {
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

  // Fetch all asociaciones
  const { data: asociaciones, error } = await supabase
    .from("asociaciones")
    .select("id, nombre")
    .eq("estado", true)
    .order("nombre")

  if (error) {
    console.error("Error fetching asociaciones:", error)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <Link href="/users/admins">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a administradores
          </Button>
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nuevo Administrador de Asociación</h2>
        <p className="text-muted-foreground">
          Crea una cuenta de administrador para una asociación departamental
        </p>
      </div>

      <CreateAdminForm asociaciones={asociaciones || []} />
    </div>
  )
}
