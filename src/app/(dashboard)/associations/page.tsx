import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AsociacionesTable } from "@/components/associations/associations-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AsociacionesPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in")
  }

  // Verify admin_fab role (only admin_fab can manage asociaciones)
  const { data: user } = await supabase
    .from("users")
    .select("rol")
    .eq("user_id", session.user.id)
    .single()

  if (!user || user.rol !== "admin_fab") {
    redirect("/dashboard")
  }

  // Fetch all asociaciones with user count
  const { data: asociaciones, error } = await supabase
    .from("asociaciones")
    .select(`
      id,
      nombre,
      departamento,
      ciudad,
      contacto,
      email,
      telefono,
      estado
    `)
    .order("nombre")

  if (error) {
    console.error("Error fetching asociaciones:", error)
  }

  // Get user count for each asociación
  const enrichedAsociaciones = await Promise.all(
    (asociaciones || []).map(async (asoc) => {
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("asociacion_id", asoc.id)

      return {
        ...asoc,
        user_count: count || 0,
      }
    })
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Asociaciones Departamentales</h2>
          <p className="text-muted-foreground">
            Gestiona las 9 asociaciones departamentales de la FAB
          </p>
        </div>
        <Link href="/associations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear Asociación
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asociaciones ({enrichedAsociaciones.length})</CardTitle>
          <CardDescription>
            Lista de todas las asociaciones departamentales del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AsociacionesTable data={enrichedAsociaciones} />
        </CardContent>
      </Card>
    </div>
  )
}
