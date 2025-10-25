import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreateAsociacionForm } from "@/components/associations/create-asociacion-form"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function NewAsociacionPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in")
  }

  // Verify admin_fab role (only admin_fab can create asociaciones)
  const { data: user } = await supabase
    .from("users")
    .select("rol")
    .eq("user_id", session.user.id)
    .single()

  if (!user || user.rol !== "admin_fab") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/associations">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Crear Asociación</h2>
        <p className="text-muted-foreground">
          Crea una nueva asociación departamental de la FAB
        </p>
      </div>

      {/* Form */}
      <CreateAsociacionForm />
    </div>
  )
}
