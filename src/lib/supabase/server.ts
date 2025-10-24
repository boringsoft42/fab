/**
 * Supabase Server Client
 *
 * This file provides server-side Supabase clients with different authentication levels:
 *
 * 1. createServerClient() - Standard server client using cookies (for authenticated requests)
 * 2. createAdminClient() - Service role client for admin operations (bypasses RLS)
 *
 * SECURITY WARNING:
 * - NEVER expose service role key to the client
 * - NEVER use service role in client components
 * - Only use service role in Server Actions and API routes
 * - Always validate user permissions before using admin client
 */

import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Create a Supabase client for server-side operations
 * Uses cookies to maintain session
 * Respects RLS policies
 *
 * Use this for:
 * - Server Components
 * - Server Actions
 * - API Routes (when operating as authenticated user)
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle error in middleware where cookies can't be set
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle error in middleware where cookies can't be set
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client with service role access
 * BYPASSES Row Level Security (RLS)
 *
 * ⚠️ SECURITY WARNING:
 * This client has FULL database access. Use with extreme caution.
 *
 * Use this ONLY for:
 * - Creating users (admin_fab creates admin_asociacion)
 * - Approving users (changing estado to "activo")
 * - Admin operations that require bypassing RLS
 *
 * ALWAYS validate:
 * - User is authenticated
 * - User has required rol (admin_fab or admin_asociacion)
 * - Operation is authorized for this specific user
 *
 * Example:
 * ```typescript
 * const supabase = await createServerClient();
 * const { data: { user } } = await supabase.auth.getUser();
 *
 * if (!user) {
 *   throw new Error('Unauthorized');
 * }
 *
 * const { data: userRecord } = await supabase
 *   .from('users')
 *   .select('rol')
 *   .eq('user_id', user.id)
 *   .single();
 *
 * if (userRecord?.rol !== 'admin_fab') {
 *   throw new Error('Forbidden: Only admin_fab can perform this action');
 * }
 *
 * // Now safe to use admin client
 * const adminClient = createAdminClient();
 * ```
 */
export function createAdminClient() {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations are not available.');
  }

  return createClient(
    supabaseUrl!,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Get the current user from the server-side session
 *
 * Returns null if no user is authenticated
 *
 * Use this in Server Actions and API routes to check authentication
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get the current user's role and estado from the database
 *
 * Returns null if user not found or not authenticated
 *
 * Use this to check user permissions in Server Actions
 */
export async function getUserRole(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('users')
    .select('rol, estado, asociacion_id')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Check if current user has required role
 *
 * @param allowedRoles - Array of roles allowed to perform the action
 * @returns true if user has one of the allowed roles
 *
 * Example:
 * ```typescript
 * const hasPermission = await hasRole(['admin_fab', 'admin_asociacion']);
 * if (!hasPermission) {
 *   throw new Error('Forbidden');
 * }
 * ```
 */
export async function hasRole(allowedRoles: string[]) {
  const user = await getCurrentUser();
  if (!user) return false;

  const userRole = await getUserRole(user.id);
  if (!userRole) return false;

  return allowedRoles.includes(userRole.rol);
}

/**
 * Check if current user has active estado
 *
 * @returns true if user estado is "activo"
 */
export async function isActiveUser() {
  const user = await getCurrentUser();
  if (!user) return false;

  const userRole = await getUserRole(user.id);
  if (!userRole) return false;

  return userRole.estado === 'activo';
}
