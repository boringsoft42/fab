"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function signInAction(email: string, password: string) {
  const supabase = await createServerClient()

  // Sign in with password
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return {
      error: authError.message,
      success: false
    }
  }

  if (!authData.user) {
    return {
      error: "No user returned from authentication",
      success: false
    }
  }

  // Fetch user data to determine rol and estado
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("rol, estado")
    .eq("user_id", authData.user.id)
    .single()

  if (userError || !userData) {
    return {
      error: "User data not found in database",
      success: false
    }
  }

  // Determine redirect URL based on rol and estado
  const { rol, estado } = userData

  let redirectUrl = "/dashboard"

  if (estado === "pendiente") {
    redirectUrl = `/dashboard/${rol}-pending`
  } else if (estado === "activo") {
    const dashboardRoutes: Record<string, string> = {
      admin_fab: "/dashboard/admin-fab",
      admin_asociacion: "/dashboard/admin-asociacion",
      atleta: "/dashboard/atleta-activo",
      entrenador: "/dashboard/entrenador-activo",
      juez: "/dashboard/juez-activo",
    }
    redirectUrl = dashboardRoutes[rol] || "/dashboard"
  }

  // Redirect will happen after return
  redirect(redirectUrl)
}
