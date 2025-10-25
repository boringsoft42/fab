import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react"

/**
 * Atleta Pending Dashboard
 * Task 6.4, REQ-10.5.1, REQ-1.3.5
 *
 * Dashboard for atletas with estado="pendiente"
 * Shows account review message and profile completion CTA
 */

export default async function AtletaPendingDashboard() {
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
    .select("user_id, rol, estado")
    .eq("user_id", user.id)
    .single()

  if (userError || !userData || userData.rol !== "atleta" || userData.estado !== "pendiente") {
    redirect("/dashboard")
  }

  // Check if profile exists
  const { data: atletaProfile } = await supabase
    .from("atletas")
    .select("user_id, estado, fecha_registro")
    .eq("user_id", user.id)
    .single()

  const hasProfile = !!atletaProfile
  const profileComplete = hasProfile

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido</h1>
        <p className="text-muted-foreground mt-2">
          Tu cuenta de atleta está en revisión
        </p>
      </div>

      {/* Status Alert */}
      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <Clock className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-900 dark:text-yellow-100">
          Cuenta en Revisión
        </AlertTitle>
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          Tu cuenta está siendo revisada por la administración de FAB. Recibirás un
          correo electrónico cuando sea aprobada. Mientras tanto, puedes completar tu
          perfil.
        </AlertDescription>
      </Alert>

      {/* Profile Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Estado del Perfil</span>
            <Badge variant={profileComplete ? "default" : "secondary"}>
              {profileComplete ? "Completado" : "Incompleto"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {profileComplete
              ? "Tu perfil está completo y listo para revisión"
              : "Completa tu perfil para continuar con el proceso de aprobación"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Registration Step */}
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Registro de Cuenta</p>
                <p className="text-sm text-muted-foreground">
                  Cuenta creada exitosamente
                </p>
              </div>
            </div>

            {/* Profile Creation Step */}
            <div className="flex items-center gap-3">
              {profileComplete ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <div className="flex-1">
                <p className="font-medium">Perfil de Atleta</p>
                <p className="text-sm text-muted-foreground">
                  {profileComplete
                    ? "Perfil completado"
                    : "Completa tu perfil con datos personales y documentos"}
                </p>
              </div>
              {!profileComplete && (
                <Link href="/profile/atleta">
                  <Button>Completar Perfil</Button>
                </Link>
              )}
            </div>

            {/* Approval Step */}
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Aprobación FAB</p>
                <p className="text-sm text-muted-foreground">
                  Esperando revisión del administrador FAB
                </p>
              </div>
            </div>
          </div>

          {profileComplete && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-start gap-3 text-sm">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Perfil registrado el:</p>
                  <p className="text-muted-foreground">
                    {new Date(atletaProfile.fecha_registro).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {profileComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Acciones Disponibles</CardTitle>
            <CardDescription>
              Mientras esperas la aprobación, puedes:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Ver Mi Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-lg">¿Necesitas Ayuda?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • El proceso de revisión puede tomar de 1 a 3 días hábiles
          </p>
          <p>
            • Asegúrate de que tu perfil esté completo y todos los documentos estén
            subidos correctamente
          </p>
          <p>
            • Si tienes preguntas, contacta a la administración de FAB
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
