import * as z from "zod"

/**
 * Atleta Validation Schema
 * REQ-2.1.x, Task 3.12.1
 *
 * 100% aligned with Prisma schema: model atletas
 * All fields match database column types and constraints
 */

/**
 * Step 1: Datos Personales (BLOQUEADOS después de creación)
 * REQ-2.1.1, REQ-2.1.2
 */
export const atletaDatosPersonalesSchema = z.object({
  nombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  ci: z.string().min(5, "CI inválido").max(20, "CI demasiado largo"),
  fecha_nacimiento: z.string().refine((date) => {
    const birthDate = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    return age >= 5 && age <= 100 // Reasonable age range for athletes
  }, "Edad debe estar entre 5 y 100 años"),
  genero: z.enum(["M", "F"], {
    required_error: "Género es obligatorio",
  }),
  nacionalidad: z.string().min(2, "Nacionalidad es obligatoria"),
  estado_civil: z.string().optional(),
})

/**
 * Step 2: Datos de Contacto (EDITABLES)
 * REQ-2.1.4, REQ-2.1.5
 */
export const atletaDatosContactoSchema = z.object({
  telefono: z.string().min(7, "Teléfono inválido").max(20),
  email: z.string().email("Email inválido"),
  direccion: z.string().min(5, "Dirección debe tener al menos 5 caracteres"),
  ciudad_residencia: z.string().min(2, "Ciudad es obligatoria"),
  departamento_residencia: z.string().min(2, "Departamento es obligatorio"),
})

/**
 * Step 3: Datos Federativos
 * REQ-2.1.6, REQ-2.1.7, REQ-2.1.8, REQ-2.1.9
 *
 * IMPORTANT: municipio is conditional
 * - Required ONLY if asociacion != "Santa Cruz"
 * - Must be NULL if asociacion == "Santa Cruz"
 */
export const atletaDatosFederativosSchema = z.object({
  asociacion_id: z.string().uuid("Asociación inválida"),
  municipio: z.string().optional().nullable(),
  categoria_fab: z.string(), // Auto-calculated, but included for completeness
  especialidad: z.string().min(2, "Especialidad es obligatoria"),
  anios_practica: z.number().int().min(0).max(50).optional().nullable(),
})

/**
 * Conditional validation for municipio
 * This function should be called with asociacion name to validate municipio
 */
export function validateMunicipio(asociacionNombre: string, municipio: string | null | undefined): boolean {
  if (asociacionNombre === "Santa Cruz") {
    return municipio === null || municipio === undefined || municipio === ""
  } else {
    return !!municipio && municipio.trim().length > 0
  }
}

/**
 * Step 4: Datos Físicos y Deportivos (EDITABLES)
 * REQ-2.1.11, REQ-2.1.12
 */
export const atletaDatosFisicosSchema = z.object({
  // Altura: 130-250 cm (Prisma: Int?)
  altura_cm: z.number().int().min(130).max(250).optional().nullable(),
  // Peso: 25-180 kg (Prisma: Decimal(5,2)?)
  peso_kg: z.number().min(25).max(180).optional().nullable(),
  talla_camiseta: z.string().optional().nullable(),
  talla_pantalon: z.string().optional().nullable(),
  talla_zapatos: z.string().optional().nullable(),
  tipo_sangre: z.string().min(1, "Tipo de sangre es obligatorio"),
  // Optional performance data
  marca_personal_mejor: z.string().optional().nullable(),
  evento_de_la_marca: z.string().optional().nullable(),
  fecha_de_la_marca: z.string().optional().nullable(),
})

/**
 * Step 5: Contacto de Emergencia (EDITABLES)
 * REQ-2.1.13
 */
export const atletaContactoEmergenciaSchema = z.object({
  contacto_emergencia: z.string().min(2, "Nombre de contacto es obligatorio"),
  telefono_emergencia: z.string().min(7, "Teléfono de emergencia es obligatorio"),
  parentesco_emergencia: z.string().min(2, "Parentesco es obligatorio"),
})

/**
 * Step 6: Documentos
 * REQ-2.1.14, REQ-2.1.15, REQ-2.1.16
 *
 * All file URLs point to Supabase Storage
 * Path structure: {bucket}/{asociacion_id}/{user_id}/{filename}
 */
export const atletaDocumentosSchema = z.object({
  // Required documents
  foto_url: z.string().url("URL de foto inválida"),
  ci_frente_url: z.string().url("URL de CI frente inválida"),
  ci_reverso_url: z.string().url("URL de CI reverso inválida"),
  // Optional documents
  certificado_medico_url: z.string().url().optional().nullable(),
  carnet_vacunacion_url: z.string().url().optional().nullable(),
})

/**
 * Complete Atleta Schema
 * Combines all steps for full profile creation/update
 */
export const atletaCompleteSchema = z.object({
  user_id: z.string().uuid(),
  ...atletaDatosPersonalesSchema.shape,
  ...atletaDatosContactoSchema.shape,
  ...atletaDatosFederativosSchema.shape,
  ...atletaDatosFisicosSchema.shape,
  ...atletaContactoEmergenciaSchema.shape,
  ...atletaDocumentosSchema.shape,
  // Auto-managed fields (not for user input)
  estado: z.enum(["pendiente", "activo", "inactivo", "rechazado"]).default("pendiente"),
  fecha_registro: z.string().optional(),
  aprobado_por_fab: z.string().uuid().optional().nullable(),
  fecha_aprobacion: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
})

/**
 * Atleta Update Schema
 * For "Mi Perfil" edits - excludes personal data fields
 * REQ-2.4.1, REQ-2.4.2
 */
export const atletaUpdateSchema = atletaCompleteSchema.omit({
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
export type AtletaDatosPersonales = z.infer<typeof atletaDatosPersonalesSchema>
export type AtletaDatosContacto = z.infer<typeof atletaDatosContactoSchema>
export type AtletaDatosFederativos = z.infer<typeof atletaDatosFederativosSchema>
export type AtletaDatosFisicos = z.infer<typeof atletaDatosFisicosSchema>
export type AtletaContactoEmergencia = z.infer<typeof atletaContactoEmergenciaSchema>
export type AtletaDocumentos = z.infer<typeof atletaDocumentosSchema>
export type AtletaComplete = z.infer<typeof atletaCompleteSchema>
export type AtletaUpdate = z.infer<typeof atletaUpdateSchema>
