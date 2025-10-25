"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Image from "next/image"

type UserProfile = {
  // Common fields
  user_id: string
  rol: string
  estado: string
  asociacion_nombre: string
  created_at: string

  // Profile fields
  nombre: string
  apellido: string
  ci: string
  fecha_nacimiento: string
  genero: string
  nacionalidad: string
  estado_civil?: string
  telefono: string
  email: string
  direccion: string
  ciudad_residencia: string
  departamento_residencia: string

  // Athlete-specific
  municipio?: string
  categoria_fab?: string
  especialidad?: string
  anios_practica?: number

  // Coach/Judge-specific
  anios_experiencia?: number
  nivel_juez?: string
  certificaciones?: string

  // Physical data
  altura_cm?: number
  peso_kg?: number
  tipo_sangre: string

  // Emergency contact
  contacto_emergencia: string
  telefono_emergencia: string
  parentesco_emergencia: string

  // Documents
  foto_url: string
  ci_frente_url: string
  ci_reverso_url: string
  certificado_medico_url?: string

  // Approval data
  aprobado_por_fab?: string
  fecha_aprobacion?: string
  observaciones?: string
  fecha_registro: string
}

export function UserDetailView({ user }: { user: UserProfile }) {
  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: "bg-yellow-100 text-yellow-800",
      activo: "bg-green-100 text-green-800",
      inactivo: "bg-gray-100 text-gray-800",
      rechazado: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[estado] || ""}>{estado.toUpperCase()}</Badge>
  }

  const getRolBadge = (rol: string) => {
    const colors: Record<string, string> = {
      atleta: "bg-blue-100 text-blue-800",
      entrenador: "bg-green-100 text-green-800",
      juez: "bg-purple-100 text-purple-800",
    }
    return <Badge className={colors[rol] || ""}>{rol}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            {user.nombre} {user.apellido}
          </h2>
          <p className="text-muted-foreground">CI: {user.ci}</p>
        </div>
        <div className="flex gap-2">
          {getRolBadge(user.rol)}
          {getEstadoBadge(user.estado)}
        </div>
      </div>

      {/* Personal Data */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Personales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Nombre Completo</Label>
            <p className="font-medium">{user.nombre} {user.apellido}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">CI</Label>
            <p className="font-medium">{user.ci}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Fecha de Nacimiento</Label>
            <p className="font-medium">{new Date(user.fecha_nacimiento).toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Género</Label>
            <p className="font-medium">{user.genero === "M" ? "Masculino" : "Femenino"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Nacionalidad</Label>
            <p className="font-medium">{user.nacionalidad}</p>
          </div>
          {user.estado_civil && (
            <div>
              <Label className="text-muted-foreground">Estado Civil</Label>
              <p className="font-medium">{user.estado_civil}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Data */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Teléfono</Label>
            <p className="font-medium">{user.telefono}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Dirección</Label>
            <p className="font-medium">{user.direccion}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Ciudad</Label>
            <p className="font-medium">{user.ciudad_residencia}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Departamento</Label>
            <p className="font-medium">{user.departamento_residencia}</p>
          </div>
        </CardContent>
      </Card>

      {/* Federation Data */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Federativos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Asociación</Label>
            <p className="font-medium">{user.asociacion_nombre}</p>
          </div>
          {user.municipio && (
            <div>
              <Label className="text-muted-foreground">Municipio</Label>
              <p className="font-medium">{user.municipio}</p>
            </div>
          )}
          {user.categoria_fab && (
            <div>
              <Label className="text-muted-foreground">Categoría FAB</Label>
              <p className="font-medium">{user.categoria_fab}</p>
            </div>
          )}
          {user.especialidad && (
            <div>
              <Label className="text-muted-foreground">Especialidad</Label>
              <p className="font-medium">{user.especialidad}</p>
            </div>
          )}
          {user.anios_practica && (
            <div>
              <Label className="text-muted-foreground">Años de Práctica</Label>
              <p className="font-medium">{user.anios_practica}</p>
            </div>
          )}
          {user.anios_experiencia && (
            <div>
              <Label className="text-muted-foreground">Años de Experiencia</Label>
              <p className="font-medium">{user.anios_experiencia}</p>
            </div>
          )}
          {user.nivel_juez && (
            <div>
              <Label className="text-muted-foreground">Nivel de Juez</Label>
              <p className="font-medium">{user.nivel_juez}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Physical Data */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Físicos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {user.altura_cm && (
            <div>
              <Label className="text-muted-foreground">Altura</Label>
              <p className="font-medium">{user.altura_cm} cm</p>
            </div>
          )}
          {user.peso_kg && (
            <div>
              <Label className="text-muted-foreground">Peso</Label>
              <p className="font-medium">{user.peso_kg} kg</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">Tipo de Sangre</Label>
            <p className="font-medium">{user.tipo_sangre}</p>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contacto de Emergencia</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-muted-foreground">Contacto</Label>
            <p className="font-medium">{user.contacto_emergencia}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Teléfono</Label>
            <p className="font-medium">{user.telefono_emergencia}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Parentesco</Label>
            <p className="font-medium">{user.parentesco_emergencia}</p>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-muted-foreground">Foto</Label>
            {user.foto_url ? (
              <a href={user.foto_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Ver foto
              </a>
            ) : (
              <p className="text-muted-foreground">No disponible</p>
            )}
          </div>
          <div>
            <Label className="text-muted-foreground">CI Frente</Label>
            {user.ci_frente_url ? (
              <a href={user.ci_frente_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Ver documento
              </a>
            ) : (
              <p className="text-muted-foreground">No disponible</p>
            )}
          </div>
          <div>
            <Label className="text-muted-foreground">CI Reverso</Label>
            {user.ci_reverso_url ? (
              <a href={user.ci_reverso_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Ver documento
              </a>
            ) : (
              <p className="text-muted-foreground">No disponible</p>
            )}
          </div>
          {user.certificado_medico_url && (
            <div>
              <Label className="text-muted-foreground">Certificado Médico</Label>
              <a href={user.certificado_medico_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Ver documento
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Info */}
      {(user.estado === "activo" || user.estado === "rechazado") && (
        <Card>
          <CardHeader>
            <CardTitle>Información de Aprobación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.fecha_aprobacion && (
              <div>
                <Label className="text-muted-foreground">Fecha de Aprobación</Label>
                <p className="font-medium">{new Date(user.fecha_aprobacion).toLocaleString()}</p>
              </div>
            )}
            {user.observaciones && (
              <div>
                <Label className="text-muted-foreground">Observaciones</Label>
                <p className="font-medium">{user.observaciones}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Registration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Registro</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Fecha de Registro</Label>
            <p className="font-medium">{new Date(user.fecha_registro).toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">ID de Usuario</Label>
            <p className="font-mono text-xs">{user.user_id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
