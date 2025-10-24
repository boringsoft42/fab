import { createClient } from "@supabase/supabase-js";
import { applyPasswordHashMiddleware } from "./password-hash-middleware";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create base client without password hashing (for FAB system)
// FAB uses standard Supabase authentication without client-side password hashing
const baseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: "app-token",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

// Export the clean client for FAB authentication
export const supabase = baseClient;

// Legacy client with password hash middleware (for backward compatibility)
// This is NOT used in the FAB system
export const legacySupabase = applyPasswordHashMiddleware(baseClient);
