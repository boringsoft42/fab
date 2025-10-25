"use server";

import { createServerClient } from "@/lib/supabase/server";

/**
 * Server Actions for Admin FAB Dashboard
 *
 * These actions fetch real-time metrics and data for the admin_fab dashboard:
 * - User statistics by rol and estado
 * - Pending approvals (users, payments, events)
 * - Recent activity
 */

export interface DashboardMetrics {
  totalUsers: number;
  usersByRol: {
    atleta: number;
    entrenador: number;
    juez: number;
    admin_asociacion: number;
  };
  pendingUsers: {
    total: number;
    atletas: number;
    entrenadores: number;
    jueces: number;
  };
  pendingPayments: {
    total: number;
    totalAmount: number;
  };
  activeEvents: {
    total: number;
    federativo: number;
    asociacion: number;
  };
  adminAsociaciones: {
    total: number;
    activos: number;
    inactivos: number;
  };
}

export interface RecentUser {
  user_id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: string;
  asociacion_nombre: string;
  fecha_registro: string;
}

export interface PendingPayment {
  id: string;
  asociacion_nombre: string;
  evento_nombre: string;
  monto: number;
  fecha_pago: string | null;
  comprobante_url: string | null;
  metodo_pago: string | null;
}

export interface UpcomingEvent {
  id: string;
  nombre: string;
  tipo: string;
  estado: string;
  fecha_evento: string;
  ciudad: string;
  total_inscritos: number;
}

/**
 * Get comprehensive dashboard metrics for admin_fab
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createServerClient();

  try {
    // Get total users by rol
    const { data: usersByRol, error: usersByRolError } = await supabase
      .from("users")
      .select("rol")
      .not("estado", "eq", "rechazado"); // Exclude rejected users

    if (usersByRolError) throw usersByRolError;

    // Get pending users by rol
    const { data: pendingUsers, error: pendingUsersError } = await supabase
      .from("users")
      .select("rol")
      .eq("estado", "pendiente");

    if (pendingUsersError) throw pendingUsersError;

    // Get pending payments
    const { data: pendingPayments, error: pendingPaymentsError } = await supabase
      .from("pagos_evento_asociacion")
      .select("monto")
      .eq("estado_pago", "pendiente");

    if (pendingPaymentsError) throw pendingPaymentsError;

    // Get active events (not finalized or rejected)
    const { data: activeEvents, error: activeEventsError } = await supabase
      .from("eventos")
      .select("tipo")
      .in("estado", ["borrador", "en_revision", "aprobado"]);

    if (activeEventsError) throw activeEventsError;

    // Get admin asociaciones
    const { data: adminAsociaciones, error: adminAsociacionesError } = await supabase
      .from("users")
      .select("estado")
      .eq("rol", "admin_asociacion");

    if (adminAsociacionesError) throw adminAsociacionesError;

    // Calculate metrics
    const usersByRolCount = {
      atleta: usersByRol?.filter((u) => u.rol === "atleta").length || 0,
      entrenador: usersByRol?.filter((u) => u.rol === "entrenador").length || 0,
      juez: usersByRol?.filter((u) => u.rol === "juez").length || 0,
      admin_asociacion: usersByRol?.filter((u) => u.rol === "admin_asociacion").length || 0,
    };

    const pendingUsersCount = {
      total: pendingUsers?.length || 0,
      atletas: pendingUsers?.filter((u) => u.rol === "atleta").length || 0,
      entrenadores: pendingUsers?.filter((u) => u.rol === "entrenador").length || 0,
      jueces: pendingUsers?.filter((u) => u.rol === "juez").length || 0,
    };

    const pendingPaymentsData = {
      total: pendingPayments?.length || 0,
      totalAmount: pendingPayments?.reduce((acc, p) => acc + Number(p.monto), 0) || 0,
    };

    const activeEventsData = {
      total: activeEvents?.length || 0,
      federativo: activeEvents?.filter((e) => e.tipo === "federativo").length || 0,
      asociacion: activeEvents?.filter((e) => e.tipo === "asociacion").length || 0,
    };

    const adminAsociacionesData = {
      total: adminAsociaciones?.length || 0,
      activos: adminAsociaciones?.filter((a) => a.estado === "activo").length || 0,
      inactivos: adminAsociaciones?.filter((a) => a.estado === "inactivo").length || 0,
    };

    return {
      totalUsers: usersByRol?.length || 0,
      usersByRol: usersByRolCount,
      pendingUsers: pendingUsersCount,
      pendingPayments: pendingPaymentsData,
      activeEvents: activeEventsData,
      adminAsociaciones: adminAsociacionesData,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    // Return empty metrics on error
    return {
      totalUsers: 0,
      usersByRol: {
        atleta: 0,
        entrenador: 0,
        juez: 0,
        admin_asociacion: 0,
      },
      pendingUsers: {
        total: 0,
        atletas: 0,
        entrenadores: 0,
        jueces: 0,
      },
      pendingPayments: {
        total: 0,
        totalAmount: 0,
      },
      activeEvents: {
        total: 0,
        federativo: 0,
        asociacion: 0,
      },
      adminAsociaciones: {
        total: 0,
        activos: 0,
        inactivos: 0,
      },
    };
  }
}

/**
 * Get recent users registered (last 5)
 */
export async function getRecentUsers(): Promise<RecentUser[]> {
  const supabase = await createServerClient();

  try {
    // Get recent users from each role-specific table
    const [atletasResult, entrenadoresResult, juecesResult] = await Promise.all([
      supabase
        .from("atletas")
        .select("user_id, nombre, apellido, email, estado, fecha_registro, asociacion_id, asociaciones(nombre)")
        .order("fecha_registro", { ascending: false })
        .limit(5),
      supabase
        .from("entrenadores")
        .select("user_id, nombre, apellido, email, estado, fecha_registro, asociacion_id, asociaciones(nombre)")
        .order("fecha_registro", { ascending: false })
        .limit(5),
      supabase
        .from("jueces")
        .select("user_id, nombre, apellido, email, estado, fecha_registro, asociacion_id, asociaciones(nombre)")
        .order("fecha_registro", { ascending: false })
        .limit(5),
    ]);

    const atletas = atletasResult.data?.map((a: any) => ({
      user_id: a.user_id,
      nombre: a.nombre,
      apellido: a.apellido,
      email: a.email,
      rol: "atleta",
      estado: a.estado,
      asociacion_nombre: a.asociaciones?.nombre || "N/A",
      fecha_registro: a.fecha_registro,
    })) || [];

    const entrenadores = entrenadoresResult.data?.map((e: any) => ({
      user_id: e.user_id,
      nombre: e.nombre,
      apellido: e.apellido,
      email: e.email,
      rol: "entrenador",
      estado: e.estado,
      asociacion_nombre: e.asociaciones?.nombre || "N/A",
      fecha_registro: e.fecha_registro,
    })) || [];

    const jueces = juecesResult.data?.map((j: any) => ({
      user_id: j.user_id,
      nombre: j.nombre,
      apellido: j.apellido,
      email: j.email,
      rol: "juez",
      estado: j.estado,
      asociacion_nombre: j.asociaciones?.nombre || "N/A",
      fecha_registro: j.fecha_registro,
    })) || [];

    // Combine and sort by fecha_registro
    const allUsers = [...atletas, ...entrenadores, ...jueces]
      .sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime())
      .slice(0, 5);

    return allUsers;
  } catch (error) {
    console.error("Error fetching recent users:", error);
    return [];
  }
}

/**
 * Get pending payments (last 5)
 */
export async function getPendingPayments(): Promise<PendingPayment[]> {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("pagos_evento_asociacion")
      .select(`
        id,
        monto,
        fecha_pago,
        comprobante_url,
        metodo_pago,
        asociaciones(nombre),
        eventos(nombre)
      `)
      .eq("estado_pago", "pendiente")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    return data?.map((p: any) => ({
      id: p.id,
      asociacion_nombre: p.asociaciones?.nombre || "N/A",
      evento_nombre: p.eventos?.nombre || "N/A",
      monto: Number(p.monto),
      fecha_pago: p.fecha_pago,
      comprobante_url: p.comprobante_url,
      metodo_pago: p.metodo_pago,
    })) || [];
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    return [];
  }
}

/**
 * Get upcoming events (next 5)
 */
export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("eventos")
      .select(`
        id,
        nombre,
        tipo,
        estado,
        fecha_evento,
        ciudad,
        inscripciones(count)
      `)
      .gte("fecha_evento", new Date().toISOString().split("T")[0])
      .in("estado", ["borrador", "en_revision", "aprobado"])
      .order("fecha_evento", { ascending: true })
      .limit(5);

    if (error) throw error;

    return data?.map((e: any) => ({
      id: e.id,
      nombre: e.nombre,
      tipo: e.tipo,
      estado: e.estado,
      fecha_evento: e.fecha_evento,
      ciudad: e.ciudad,
      total_inscritos: e.inscripciones?.[0]?.count || 0,
    })) || [];
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}
