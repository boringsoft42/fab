import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditAsociacionForm } from "@/components/associations/edit-asociacion-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditAsociacionPage({
  params,
}: {
  params: { id: string }
}) {
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

  // Fetch asociación data
  const { data: asociacion, error } = await supabase
    .from("asociaciones")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !asociacion) {
    redirect("/associations")
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <Link href="/associations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a asociaciones
          </Button>
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Editar Asociación</h2>
        <p className="text-muted-foreground">
          Actualiza la información de la asociación departamental
        </p>
      </div>

      <EditAsociacionForm asociacion={asociacion} />
    </div>
  )
}
