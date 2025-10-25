"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Server Action: Approve a pending user
 * REQ-1.3.2, REQ-2.1.18, REQ-2.1.19
 *
 * Changes user estado from "pendiente" to "activo"
 * Records approval metadata (aprobado_por_fab, fecha_aprobacion)
 */
export async function approveUserAction(userId: string, observaciones?: string) {
  try {
    const supabase = await createServerClient()

    // Get current admin user
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
      return { error: "No autorizado. Solo admin_fab puede aprobar usuarios.", success: false }
    }

    // Get user data to determine profile table
    const { data: userData } = await supabase
      .from("users")
      .select("rol, estado")
      .eq("user_id", userId)
      .single()

    if (!userData) {
      return { error: "Usuario no encontrado", success: false }
    }

    if (userData.estado !== "pendiente") {
      return { error: `Usuario ya está en estado: ${userData.estado}`, success: false }
    }

    // Update users table
    const { error: usersError } = await supabase
      .from("users")
      .update({
        estado: "activo",
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)

    if (usersError) {
      console.error("Error updating users table:", usersError)
      return { error: "Error al actualizar estado del usuario", success: false }
    }

    // Update corresponding profile table based on rol
    const profileTable = getProfileTable(userData.rol)
    if (profileTable) {
      const { error: profileError } = await supabase
        .from(profileTable)
        .update({
          estado: "activo",
          aprobado_por_fab: currentUser.id,
          fecha_aprobacion: new Date().toISOString(),
          observaciones: observaciones || null,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)

      if (profileError) {
        console.error(`Error updating ${profileTable} table:`, profileError)
        return { error: `Error al actualizar perfil de ${userData.rol}`, success: false }
      }
    }

    // TODO: Send approval email notification (Task 7.5.5)
    // await sendApprovalEmail(userId)

    revalidatePath("/users/pending")
    return {
      success: true,
      message: `Usuario aprobado exitosamente${observaciones ? ' con observaciones' : ''}`
    }

  } catch (error: any) {
    console.error("Approve user error:", error)
    return { error: error.message || "Error al aprobar usuario", success: false }
  }
}

/**
 * Server Action: Reject a pending user
 * REQ-1.3.2, REQ-2.1.18, REQ-2.1.19
 *
 * Changes user estado from "pendiente" to "rechazado"
 * Requires observaciones (motivo del rechazo)
 */
export async function rejectUserAction(userId: string, motivo: string) {
  try {
    if (!motivo || motivo.trim().length === 0) {
      return { error: "El motivo del rechazo es obligatorio", success: false }
    }

    const supabase = await createServerClient()

    // Get current admin user
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
      return { error: "No autorizado. Solo admin_fab puede rechazar usuarios.", success: false }
    }

    // Get user data
    const { data: userData } = await supabase
      .from("users")
      .select("rol, estado")
      .eq("user_id", userId)
      .single()

    if (!userData) {
      return { error: "Usuario no encontrado", success: false }
    }

    if (userData.estado !== "pendiente") {
      return { error: `Usuario ya está en estado: ${userData.estado}`, success: false }
    }

    // Update users table
    const { error: usersError } = await supabase
      .from("users")
      .update({
        estado: "rechazado",
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)

    if (usersError) {
      console.error("Error updating users table:", usersError)
      return { error: "Error al actualizar estado del usuario", success: false }
    }

    // Update corresponding profile table
    const profileTable = getProfileTable(userData.rol)
    if (profileTable) {
      const { error: profileError } = await supabase
        .from(profileTable)
        .update({
          estado: "rechazado",
          observaciones: motivo,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)

      if (profileError) {
        console.error(`Error updating ${profileTable} table:`, profileError)
        return { error: `Error al actualizar perfil de ${userData.rol}`, success: false }
      }
    }

    // TODO: Send rejection email notification with motivo (Task 7.5.6)
    // await sendRejectionEmail(userId, motivo)

    revalidatePath("/users/pending")
    return {
      success: true,
      message: "Usuario rechazado exitosamente"
    }

  } catch (error: any) {
    console.error("Reject user error:", error)
    return { error: error.message || "Error al rechazar usuario", success: false }
  }
}

/**
 * Helper function to get profile table name based on rol
 */
function getProfileTable(rol: string): string | null {
  switch (rol) {
    case "atleta":
      return "atletas"
    case "entrenador":
      return "entrenadores"
    case "juez":
      return "jueces"
    case "admin_fab":
    case "admin_asociacion":
      // These roles don't have separate profile tables
      return null
    default:
      return null
  }
}
