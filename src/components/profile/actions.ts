"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AtletaComplete } from "@/lib/validations/atleta"
import type { EntrenadorComplete } from "@/lib/validations/entrenador"
import type { JuezComplete } from "@/lib/validations/juez"

/**
 * Profile Creation Server Actions
 * Task 3.5.5, 3.6.5, 3.7.5
 * REQ-2.1.x, REQ-2.2.x, REQ-2.3.x
 */

/**
 * Create Atleta Profile
 * REQ-2.1.17, REQ-2.1.18
 */
export async function createAtletaProfileAction(data: AtletaComplete) {
  try {
    const supabase = await createServerClient()

    // 1. Authenticate current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autenticado" }
    }

    // 2. Verify user_id matches
    if (data.user_id !== user.id) {
      return { success: false, error: "Usuario no coincide" }
    }

    // 3. Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("atletas")
      .select("user_id")
      .eq("user_id", user.id)
      .single()

    if (existingProfile) {
      return { success: false, error: "El perfil ya existe" }
    }

    // 4. Convert date strings to Date objects for Prisma
    const profileData = {
      ...data,
      fecha_nacimiento: new Date(data.fecha_nacimiento).toISOString(),
      fecha_de_la_marca: data.fecha_de_la_marca
        ? new Date(data.fecha_de_la_marca).toISOString()
        : null,
      estado: "pendiente" as const,
      fecha_registro: new Date().toISOString(),
    }

    // 5. Insert into atletas table
    const { error: insertError } = await supabase
      .from("atletas")
      .insert(profileData)

    if (insertError) {
      console.error("Insert error:", insertError)
      return { success: false, error: "Error al crear el perfil" }
    }

    // 6. Update users table estado to "pendiente"
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ estado: "pendiente" })
      .eq("user_id", user.id)

    if (updateUserError) {
      console.error("Update user error:", updateUserError)
    }

    // TODO: Task 7.5.1 - Send email notification to user
    // TODO: Task 7.5.2 - Send email notification to admin_fab

    revalidatePath("/dashboard")
    revalidatePath("/users/pending")

    return { success: true }
  } catch (error) {
    console.error("Create atleta profile error:", error)
    return { success: false, error: "Error inesperado" }
  }
}

/**
 * Create Entrenador Profile
 * REQ-2.2.17, REQ-2.2.18
 */
export async function createEntrenadorProfileAction(data: EntrenadorComplete) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autenticado" }
    }

    if (data.user_id !== user.id) {
      return { success: false, error: "Usuario no coincide" }
    }

    const { data: existingProfile } = await supabase
      .from("entrenadores")
      .select("user_id")
      .eq("user_id", user.id)
      .single()

    if (existingProfile) {
      return { success: false, error: "El perfil ya existe" }
    }

    const profileData = {
      ...data,
      fecha_nacimiento: new Date(data.fecha_nacimiento).toISOString(),
      estado: "pendiente" as const,
      fecha_registro: new Date().toISOString(),
    }

    const { error: insertError } = await supabase
      .from("entrenadores")
      .insert(profileData)

    if (insertError) {
      console.error("Insert error:", insertError)
      return { success: false, error: "Error al crear el perfil" }
    }

    const { error: updateUserError } = await supabase
      .from("users")
      .update({ estado: "pendiente" })
      .eq("user_id", user.id)

    if (updateUserError) {
      console.error("Update user error:", updateUserError)
    }

    // TODO: Task 7.5.1 - Send email notification to user
    // TODO: Task 7.5.2 - Send email notification to admin_fab

    revalidatePath("/dashboard")
    revalidatePath("/users/pending")

    return { success: true }
  } catch (error) {
    console.error("Create entrenador profile error:", error)
    return { success: false, error: "Error inesperado" }
  }
}

/**
 * Create Juez Profile
 * REQ-2.3.17, REQ-2.3.18
 */
export async function createJuezProfileAction(data: JuezComplete) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autenticado" }
    }

    if (data.user_id !== user.id) {
      return { success: false, error: "Usuario no coincide" }
    }

    const { data: existingProfile } = await supabase
      .from("jueces")
      .select("user_id")
      .eq("user_id", user.id)
      .single()

    if (existingProfile) {
      return { success: false, error: "El perfil ya existe" }
    }

    const profileData = {
      ...data,
      fecha_nacimiento: new Date(data.fecha_nacimiento).toISOString(),
      estado: "pendiente" as const,
      fecha_registro: new Date().toISOString(),
    }

    const { error: insertError } = await supabase.from("jueces").insert(profileData)

    if (insertError) {
      console.error("Insert error:", insertError)
      return { success: false, error: "Error al crear el perfil" }
    }

    const { error: updateUserError } = await supabase
      .from("users")
      .update({ estado: "pendiente" })
      .eq("user_id", user.id)

    if (updateUserError) {
      console.error("Update user error:", updateUserError)
    }

    // TODO: Task 7.5.1 - Send email notification to user
    // TODO: Task 7.5.2 - Send email notification to admin_fab

    revalidatePath("/dashboard")
    revalidatePath("/users/pending")

    return { success: true }
  } catch (error) {
    console.error("Create juez profile error:", error)
    return { success: false, error: "Error inesperado" }
  }
}

/**
 * Update Profile Data (for "Mi Perfil" page)
 * Task 3.8.x
 * REQ-2.4.1, REQ-2.4.2, REQ-2.4.4
 *
 * Only allows updating editable fields (not personal data)
 */
export async function updateAtletaProfileAction(
  userId: string,
  data: Partial<AtletaComplete>
) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autenticado" }
    }

    if (userId !== user.id) {
      return { success: false, error: "Usuario no coincide" }
    }

    // Remove fields that should not be updated
    const {
      user_id,
      nombre,
      apellido,
      ci,
      fecha_nacimiento,
      estado,
      fecha_registro,
      aprobado_por_fab,
      fecha_aprobacion,
      ...updateData
    } = data

    const { error: updateError } = await supabase
      .from("atletas")
      .update(updateData)
      .eq("user_id", userId)

    if (updateError) {
      console.error("Update error:", updateError)
      return { success: false, error: "Error al actualizar el perfil" }
    }

    revalidatePath("/profile")

    return { success: true }
  } catch (error) {
    console.error("Update atleta profile error:", error)
    return { success: false, error: "Error inesperado" }
  }
}

export async function updateEntrenadorProfileAction(
  userId: string,
  data: Partial<EntrenadorComplete>
) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autenticado" }
    }

    if (userId !== user.id) {
      return { success: false, error: "Usuario no coincide" }
    }

    const {
      user_id,
      nombre,
      apellido,
      ci,
      fecha_nacimiento,
      estado,
      fecha_registro,
      aprobado_por_fab,
      fecha_aprobacion,
      ...updateData
    } = data

    const { error: updateError } = await supabase
      .from("entrenadores")
      .update(updateData)
      .eq("user_id", userId)

    if (updateError) {
      console.error("Update error:", updateError)
      return { success: false, error: "Error al actualizar el perfil" }
    }

    revalidatePath("/profile")

    return { success: true }
  } catch (error) {
    console.error("Update entrenador profile error:", error)
    return { success: false, error: "Error inesperado" }
  }
}

export async function updateJuezProfileAction(
  userId: string,
  data: Partial<JuezComplete>
) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autenticado" }
    }

    if (userId !== user.id) {
      return { success: false, error: "Usuario no coincide" }
    }

    const {
      user_id,
      nombre,
      apellido,
      ci,
      fecha_nacimiento,
      estado,
      fecha_registro,
      aprobado_por_fab,
      fecha_aprobacion,
      ...updateData
    } = data

    const { error: updateError } = await supabase
      .from("jueces")
      .update(updateData)
      .eq("user_id", userId)

    if (updateError) {
      console.error("Update error:", updateError)
      return { success: false, error: "Error al actualizar el perfil" }
    }

    revalidatePath("/profile")

    return { success: true }
  } catch (error) {
    console.error("Update juez profile error:", error)
    return { success: false, error: "Error inesperado" }
  }
}
