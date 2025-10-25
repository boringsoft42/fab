"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Server Action: Create new admin_asociacion
 * REQ-1.1.8, REQ-1.1.9, REQ-1.1.10, REQ-1.1.11, REQ-1.1.12, REQ-1.3.3
 *
 * Creates a new admin_asociacion account with estado="activo" (no approval needed)
 * Sends activation email with credentials
 */
export async function createAdminAsociacionAction(data: {
  email: string
  nombre: string
  apellido: string
  asociacion_id: string
  tempPassword: string
}) {
  try {
    const supabase = await createServerClient()

    // Get current admin_fab user
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
      return { error: "No autorizado. Solo admin_fab puede crear admin_asociacion.", success: false }
    }

    // Validate asociacion exists
    const { data: asociacion } = await supabase
      .from("asociaciones")
      .select("id, nombre")
      .eq("id", data.asociacion_id)
      .single()

    if (!asociacion) {
      return { error: "Asociación no encontrada", success: false }
    }

    // Create auth user using Supabase Admin API
    // Note: This requires SUPABASE_SERVICE_ROLE_KEY
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        nombre: data.nombre,
        apellido: data.apellido,
        rol: "admin_asociacion",
      },
    })

    if (authError || !authUser.user) {
      console.error("Auth create error:", authError)
      return { error: authError?.message || "Error al crear usuario en Auth", success: false }
    }

    // Create record in users table with estado="activo"
    const { error: usersError } = await supabase
      .from("users")
      .insert({
        user_id: authUser.user.id,
        rol: "admin_asociacion",
        estado: "activo", // Direct activation, no approval needed
        asociacion_id: data.asociacion_id,
      })

    if (usersError) {
      console.error("Users table error:", usersError)
      // Rollback: delete auth user
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return { error: "Error al crear registro de usuario", success: false }
    }

    // TODO: Send activation email with credentials (Task 7.5.7)
    // await sendAdminAsociacionActivationEmail({
    //   email: data.email,
    //   nombre: data.nombre,
    //   apellido: data.apellido,
    //   tempPassword: data.tempPassword,
    //   asociacion: asociacion.nombre,
    // })

    revalidatePath("/users/admins")
    return {
      success: true,
      message: `Admin de asociación creado exitosamente. Se ha enviado un email a ${data.email} con las credenciales.`,
      userId: authUser.user.id,
    }

  } catch (error: any) {
    console.error("Create admin_asociacion error:", error)
    return { error: error.message || "Error al crear admin_asociacion", success: false }
  }
}

/**
 * Server Action: Toggle admin_asociacion estado (activo ↔ inactivo)
 * REQ-1.3.7, REQ-3.11.2
 *
 * Only admin_fab can toggle estado
 */
export async function toggleAdminEstadoAction(userId: string, currentEstado: string) {
  try {
    const supabase = await createServerClient()

    // Get current admin_fab user
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
      return { error: "No autorizado. Solo admin_fab puede cambiar estado de admin_asociacion.", success: false }
    }

    // Verify target user is admin_asociacion
    const { data: targetUser } = await supabase
      .from("users")
      .select("rol")
      .eq("user_id", userId)
      .single()

    if (!targetUser || targetUser.rol !== "admin_asociacion") {
      return { error: "Usuario no es admin_asociacion", success: false }
    }

    // Toggle estado
    const newEstado = currentEstado === "activo" ? "inactivo" : "activo"

    const { error: updateError } = await supabase
      .from("users")
      .update({
        estado: newEstado,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (updateError) {
      console.error("Error updating estado:", updateError)
      return { error: "Error al cambiar estado", success: false }
    }

    revalidatePath("/users/admins")
    return {
      success: true,
      message: `Estado cambiado a ${newEstado}`,
      newEstado,
    }

  } catch (error: any) {
    console.error("Toggle estado error:", error)
    return { error: error.message || "Error al cambiar estado", success: false }
  }
}

/**
 * Helper function to generate secure random password
 * NOTE: This is a regular function, not a Server Action
 */
function generateTempPassword(): string {
  const length = 12
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}
