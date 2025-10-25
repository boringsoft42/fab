import * as z from "zod"

/**
 * Juez Validation Schema
 * REQ-2.3.x, Task 3.12.3
 *
 * 100% aligned with Prisma schema: model jueces
 * Similar structure to entrenadores with judge-specific fields
 */

/**
 * Datos Personales (BLOQUEADOS después de creación)
 */
export const juezDatosPersonalesSchema = z.object({
  nombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  ci: z.string().min(5, "CI inválido").max(20, "CI demasiado largo"),
  fecha_nacimiento: z.string().refine((date) => {
    const birthDate = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    return age >= 18 && age <= 100 // Judges should be adults
  }, "Edad debe estar entre 18 y 100 años"),
  genero: z.enum(["M", "F"], {
    required_error: "Género es obligatorio",
  }),
  nacionalidad: z.string().min(2, "Nacionalidad es obligatoria"),
  estado_civil: z.string().optional(),
})

/**
 * Datos de Contacto (EDITABLES)
 */
export const juezDatosContactoSchema = z.object({
  telefono: z.string().min(7, "Teléfono inválido").max(20),
  email: z.string().email("Email inválido"),
  direccion: z.string().min(5, "Dirección debe tener al menos 5 caracteres"),
  ciudad_residencia: z.string().min(2, "Ciudad es obligatoria"),
  departamento_residencia: z.string().min(2, "Departamento es obligatorio"),
})

/**
 * Datos Profesionales (EDITABLES)
 * REQ-2.3.2 - Specific to juez
 */
export const juezDatosProfesionalesSchema = z.object({
  asociacion_id: z.string().uuid("Asociación inválida"),
  especialidad: z.string().min(2, "Especialidad es obligatoria"),
  anios_experiencia: z.number().int().min(0, "Años de experiencia debe ser positivo"),
  nivel_juez: z.enum(["nacional", "internacional"], {
    required_error: "Nivel de juez es obligatorio",
  }),
  certificaciones: z.string().optional().nullable(),
  eventos_juzgados: z.string().optional().nullable(),
})

/**
 * Datos Físicos (EDITABLES)
 */
export const juezDatosFisicosSchema = z.object({
  altura_cm: z.number().int().min(130).max(250).optional().nullable(),
  peso_kg: z.number().min(25).max(180).optional().nullable(),
  tipo_sangre: z.string().min(1, "Tipo de sangre es obligatorio"),
})

/**
 * Contacto de Emergencia (EDITABLES)
 */
export const juezContactoEmergenciaSchema = z.object({
  contacto_emergencia: z.string().min(2, "Nombre de contacto es obligatorio"),
  telefono_emergencia: z.string().min(7, "Teléfono de emergencia es obligatorio"),
  parentesco_emergencia: z.string().min(2, "Parentesco es obligatorio"),
})

/**
 * Documentos
 * REQ-2.3.3 - Judge certification documents
 */
export const juezDocumentosSchema = z.object({
  // Required documents
  foto_url: z.string().url("URL de foto inválida"),
  ci_frente_url: z.string().url("URL de CI frente inválida"),
  ci_reverso_url: z.string().url("URL de CI reverso inválida"),
  // Optional documents
  certificado_medico_url: z.string().url().optional().nullable(),
  certificaciones_juez_url: z.string().url().optional().nullable(),
  licencia_juez_url: z.string().url().optional().nullable(),
})

/**
 * Complete Juez Schema
 */
export const juezCompleteSchema = z.object({
  user_id: z.string().uuid(),
  ...juezDatosPersonalesSchema.shape,
  ...juezDatosContactoSchema.shape,
  ...juezDatosProfesionalesSchema.shape,
  ...juezDatosFisicosSchema.shape,
  ...juezContactoEmergenciaSchema.shape,
  ...juezDocumentosSchema.shape,
  // Auto-managed fields
  estado: z.enum(["pendiente", "activo", "inactivo", "rechazado"]).default("pendiente"),
  fecha_registro: z.string().optional(),
  aprobado_por_fab: z.string().uuid().optional().nullable(),
  fecha_aprobacion: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
})

/**
 * Juez Update Schema
 * Excludes personal data fields
 */
export const juezUpdateSchema = juezCompleteSchema.omit({
  user_id: true,
  nombre: true,
  apellido: true,
  ci: true,
  fecha_nacimiento: true,
  estado: true,
  fecha_registro: true,
  aprobado_por_fab: true,
  fecha_aprobacion: true,
})

/**
 * Type exports
 */
export type JuezDatosPersonales = z.infer<typeof juezDatosPersonalesSchema>
export type JuezDatosContacto = z.infer<typeof juezDatosContactoSchema>
export type JuezDatosProfesionales = z.infer<typeof juezDatosProfesionalesSchema>
export type JuezDatosFisicos = z.infer<typeof juezDatosFisicosSchema>
export type JuezContactoEmergencia = z.infer<typeof juezContactoEmergenciaSchema>
export type JuezDocumentos = z.infer<typeof juezDocumentosSchema>
export type JuezComplete = z.infer<typeof juezCompleteSchema>
export type JuezUpdate = z.infer<typeof juezUpdateSchema>
