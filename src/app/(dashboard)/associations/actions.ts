"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Server Action: Create asociación
 * REQ-3.1.1
 *
 * Only admin_fab can create asociaciones
 */
export async function createAsociacionAction(data: {
  nombre: string
  departamento: string
  ciudad?: string
  contacto?: string
  email?: string
  telefono?: string
}) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return { error: "No autenticado", success: false }
    }

    // Verify admin_fab role
    const { data: adminData } = await supabase
      .from("users")
      .select("rol")
      .eq("user_id", currentUser.id)
      .single()

    if (!adminData || adminData.rol !== "admin_fab") {
      return { error: "No autorizado. Solo admin_fab puede crear asociaciones.", success: false }
    }

    // Check if nombre is unique
    const { data: existingAsoc, error: checkError } = await supabase
      .from("asociaciones")
      .select("id")
      .eq("nombre", data.nombre)
      .maybeSingle()

    if (existingAsoc) {
      return { error: "Ya existe una asociación con ese nombre", success: false }
    }

    // Create asociación
    const { data: newAsociacion, error: createError } = await supabase
      .from("asociaciones")
      .insert({
        nombre: data.nombre,
        departamento: data.departamento,
        ciudad: data.ciudad || null,
        contacto: data.contacto || null,
        email: data.email || null,
        telefono: data.telefono || null,
        estado: true, // Active by default
      })
      .select()

    if (createError) {
      console.error("Error creating asociación:", createError)
      return {
        error: `Error al crear asociación: ${createError.message}`,
        success: false,
        details: createError
      }
    }

    revalidatePath("/associations")
    return {
      success: true,
      message: "Asociación creada exitosamente",
    }

  } catch (error: any) {
    console.error("Create asociación error:", error)
    return { error: error.message || "Error al crear asociación", success: false }
  }
}

/**
 * Server Action: Update asociación
 * REQ-3.1.2, REQ-3.1.3
 *
 * Only admin_fab can update asociaciones
 */
export async function updateAsociacionAction(data: {
  id: string
  nombre: string
  departamento: string
  ciudad?: string
  contacto?: string
  email?: string
  telefono?: string
  estado: boolean
}) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return { error: "No autenticado", success: false }
    }

    // Verify admin_fab role
    const { data: adminData } = await supabase
      .from("users")
      .select("rol")
      .eq("user_id", currentUser.id)
      .single()

    if (!adminData || adminData.rol !== "admin_fab") {
      return { error: "No autorizado. Solo admin_fab puede editar asociaciones.", success: false }
    }

    // Check if nombre is unique (excluding current record)
    const { data: existingAsoc, error: checkError } = await supabase
      .from("asociaciones")
      .select("id")
      .eq("nombre", data.nombre)
      .neq("id", data.id)
      .maybeSingle()

    if (existingAsoc) {
      return { error: "Ya existe una asociación con ese nombre", success: false }
    }

    // Update asociación
    const { error: updateError } = await supabase
      .from("asociaciones")
      .update({
        nombre: data.nombre,
        departamento: data.departamento,
        ciudad: data.ciudad || null,
        contacto: data.contacto || null,
        email: data.email || null,
        telefono: data.telefono || null,
        estado: data.estado,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)

    if (updateError) {
      console.error("Error updating asociación:", updateError)
      return { error: "Error al actualizar asociación", success: false }
    }

    revalidatePath("/associations")
    return {
      success: true,
      message: "Asociación actualizada exitosamente",
    }

  } catch (error: any) {
    console.error("Update asociación error:", error)
    return { error: error.message || "Error al actualizar asociación", success: false }
  }
}

/**
 * Server Action: Toggle asociación estado
 * REQ-3.1.2
 *
 * Toggles between active (true) and inactive (false)
 */
export async function toggleAsociacionEstadoAction(id: string, currentEstado: boolean) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return { error: "No autenticado", success: false }
    }

    // Verify admin_fab role
    const { data: adminData } = await supabase
      .from("users")
      .select("rol")
      .eq("user_id", currentUser.id)
      .single()

    if (!adminData || adminData.rol !== "admin_fab") {
      return { error: "No autorizado. Solo admin_fab puede cambiar estado de asociaciones.", success: false }
    }

    // Check if asociación has linked users
    if (!currentEstado) {
      // Trying to activate - this is OK
    } else {
      // Trying to deactivate - check for linked users
      const { data: linkedUsers, error: usersError } = await supabase
        .from("users")
        .select("user_id")
        .eq("asociacion_id", id)
        .limit(1)

      if (linkedUsers && linkedUsers.length > 0) {
        return {
          error: "No se puede desactivar una asociación con usuarios vinculados",
          success: false
        }
      }
    }

    // Toggle estado
    const newEstado = !currentEstado

    const { error: updateError } = await supabase
      .from("asociaciones")
      .update({
        estado: newEstado,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      console.error("Error toggling estado:", updateError)
      return { error: "Error al cambiar estado", success: false }
    }

    revalidatePath("/associations")
    return {
      success: true,
      message: `Asociación ${newEstado ? "activada" : "desactivada"} exitosamente`,
      newEstado,
    }

  } catch (error: any) {
    console.error("Toggle estado error:", error)
    return { error: error.message || "Error al cambiar estado", success: false }
  }
}
