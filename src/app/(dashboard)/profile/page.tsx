import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit } from "lucide-react"

/**
 * Mi Perfil Page
 * Task 3.8, REQ-2.4.x
 *
 * Shows user's profile based on rol (atleta/entrenador/juez)
 * Personal data is locked, but editable data can be updated
 */

export default async function ProfilePage() {
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
    .select("user_id, rol, estado, asociacion_id")
    .eq("user_id", user.id)
    .single()

  if (userError || !userData) {
    redirect("/sign-in")
  }

  // Redirect admins to dashboard (they don't have profiles)
  if (userData.rol === "admin_fab" || userData.rol === "admin_asociacion") {
    redirect("/dashboard")
  }

  // Fetch profile based on rol
  let profile: any = null
  let profileTable = ""

  if (userData.rol === "atleta") {
    profileTable = "atletas"
    const { data } = await supabase
      .from("atletas")
      .select("*, asociaciones(nombre)")
      .eq("user_id", user.id)
      .single()
    profile = data
  } else if (userData.rol === "entrenador") {
    profileTable = "entrenadores"
    const { data } = await supabase
      .from("entrenadores")
      .select("*, asociaciones(nombre)")
      .eq("user_id", user.id)
      .single()
    profile = data
  } else if (userData.rol === "juez") {
    profileTable = "jueces"
    const { data } = await supabase
      .from("jueces")
      .select("*, asociaciones(nombre)")
      .eq("user_id", user.id)
      .single()
    profile = data
  }

  // If no profile exists, redirect to create profile page
  if (!profile) {
    redirect(`/profile/${userData.rol}`)
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Visualiza y actualiza tu información personal
          </p>
        </div>
        <Link href="/profile/edit">
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Estado Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Estado del Perfil</CardTitle>
                <CardDescription>Estado actual de tu cuenta</CardDescription>
              </div>
              <Badge
                variant={
                  profile.estado === "activo"
                    ? "default"
                    : profile.estado === "pendiente"
                    ? "secondary"
                    : profile.estado === "rechazado"
                    ? "destructive"
                    : "outline"
                }
              >
                {profile.estado.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          {profile.estado === "pendiente" && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tu perfil está siendo revisado por la administración de FAB.
                Recibirás una notificación cuando sea aprobado.
              </p>
            </CardContent>
          )}
          {profile.estado === "rechazado" && (
            <CardContent>
              <p className="text-sm text-destructive">
                Tu perfil ha sido rechazado.
              </p>
              {profile.observaciones && (
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium">Motivo:</span> {profile.observaciones}
                </p>
              )}
            </CardContent>
          )}
          {profile.estado === "activo" && profile.fecha_aprobacion && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aprobado el{" "}
                {new Date(profile.fecha_aprobacion).toLocaleDateString("es-ES")}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Datos Personales (LOCKED) */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
            <CardDescription>
              Esta información no puede ser modificada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                <p className="text-sm mt-1">
                  {profile.nombre} {profile.apellido}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CI</p>
                <p className="text-sm mt-1">{profile.ci}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
                <p className="text-sm mt-1">
                  {new Date(profile.fecha_nacimiento).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Género</p>
                <p className="text-sm mt-1">
                  {profile.genero === "M" ? "Masculino" : "Femenino"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nacionalidad</p>
                <p className="text-sm mt-1">{profile.nacionalidad}</p>
              </div>
              {profile.estado_civil && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado Civil</p>
                  <p className="text-sm mt-1">{profile.estado_civil}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Datos de Contacto (EDITABLE) */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de Contacto</CardTitle>
            <CardDescription>Información de contacto actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm mt-1">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <p className="text-sm mt-1">{profile.telefono}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                <p className="text-sm mt-1">{profile.direccion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ciudad</p>
                <p className="text-sm mt-1">{profile.ciudad_residencia}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departamento</p>
                <p className="text-sm mt-1">{profile.departamento_residencia}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos Federativos/Profesionales (EDITABLE) */}
        <Card>
          <CardHeader>
            <CardTitle>
              {userData.rol === "atleta" ? "Datos Federativos" : "Datos Profesionales"}
            </CardTitle>
            <CardDescription>
              {userData.rol === "atleta"
                ? "Información deportiva y federativa"
                : "Experiencia profesional"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Asociación</p>
                <p className="text-sm mt-1">{profile.asociaciones?.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Especialidad</p>
                <p className="text-sm mt-1">{profile.especialidad}</p>
              </div>
              {userData.rol === "atleta" && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categoría FAB</p>
                    <p className="text-sm mt-1">{profile.categoria_fab}</p>
                  </div>
                  {profile.municipio && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Municipio</p>
                      <p className="text-sm mt-1">{profile.municipio}</p>
                    </div>
                  )}
                  {profile.anios_practica && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Años de Práctica</p>
                      <p className="text-sm mt-1">{profile.anios_practica}</p>
                    </div>
                  )}
                </>
              )}
              {(userData.rol === "entrenador" || userData.rol === "juez") && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Años de Experiencia</p>
                  <p className="text-sm mt-1">{profile.anios_experiencia}</p>
                </div>
              )}
              {userData.rol === "juez" && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nivel de Juez</p>
                  <p className="text-sm mt-1 capitalize">{profile.nivel_juez}</p>
                </div>
              )}
            </div>

            {profile.certificaciones && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificaciones</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{profile.certificaciones}</p>
              </div>
            )}
            {profile.titulos_deportivos && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Títulos Deportivos</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{profile.titulos_deportivos}</p>
              </div>
            )}
            {profile.eventos_juzgados && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eventos Juzgados</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{profile.eventos_juzgados}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Datos Físicos (EDITABLE) */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Físicos</CardTitle>
            <CardDescription>Información física y de salud</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.altura_cm && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Altura</p>
                  <p className="text-sm mt-1">{profile.altura_cm} cm</p>
                </div>
              )}
              {profile.peso_kg && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peso</p>
                  <p className="text-sm mt-1">{profile.peso_kg} kg</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Sangre</p>
                <p className="text-sm mt-1">{profile.tipo_sangre}</p>
              </div>
            </div>

            {userData.rol === "atleta" && (
              <>
                {(profile.talla_camiseta || profile.talla_pantalon || profile.talla_zapatos) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    {profile.talla_camiseta && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Talla Camiseta</p>
                        <p className="text-sm mt-1">{profile.talla_camiseta}</p>
                      </div>
                    )}
                    {profile.talla_pantalon && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Talla Pantalón</p>
                        <p className="text-sm mt-1">{profile.talla_pantalon}</p>
                      </div>
                    )}
                    {profile.talla_zapatos && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Talla Zapatos</p>
                        <p className="text-sm mt-1">{profile.talla_zapatos}</p>
                      </div>
                    )}
                  </div>
                )}

                {(profile.marca_personal_mejor || profile.evento_de_la_marca) && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-3">Marcas Personales</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.marca_personal_mejor && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Mejor Marca</p>
                          <p className="text-sm mt-1">{profile.marca_personal_mejor}</p>
                        </div>
                      )}
                      {profile.evento_de_la_marca && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Evento</p>
                          <p className="text-sm mt-1">{profile.evento_de_la_marca}</p>
                        </div>
                      )}
                      {profile.fecha_de_la_marca && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                          <p className="text-sm mt-1">
                            {new Date(profile.fecha_de_la_marca).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Contacto de Emergencia (EDITABLE) */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto de Emergencia</CardTitle>
            <CardDescription>Persona a contactar en caso de emergencia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                <p className="text-sm mt-1">{profile.contacto_emergencia}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <p className="text-sm mt-1">{profile.telefono_emergencia}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parentesco</p>
                <p className="text-sm mt-1">{profile.parentesco_emergencia}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>
              Documentos subidos - Puedes actualizarlos desde la opción "Editar Perfil"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Foto de Perfil</span>
                <Button size="sm" variant="outline" asChild>
                  <a href={profile.foto_url} target="_blank" rel="noopener noreferrer">
                    Ver
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">CI - Frente</span>
                <Button size="sm" variant="outline" asChild>
                  <a href={profile.ci_frente_url} target="_blank" rel="noopener noreferrer">
                    Ver
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">CI - Reverso</span>
                <Button size="sm" variant="outline" asChild>
                  <a href={profile.ci_reverso_url} target="_blank" rel="noopener noreferrer">
                    Ver
                  </a>
                </Button>
              </div>
              {profile.certificado_medico_url && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Certificado Médico</span>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={profile.certificado_medico_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
