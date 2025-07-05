import { createClient } from &ldquo;@supabase/supabase-js&rdquo;;
import { applyPasswordHashMiddleware } from &ldquo;./password-hash-middleware&rdquo;;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(&ldquo;Missing Supabase environment variables&rdquo;);
}

// Create base client
const baseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: &ldquo;app-token&rdquo;,
    storage: typeof window !== &ldquo;undefined&rdquo; ? window.localStorage : undefined,
  },
});

// Apply password hash middleware to handle client-side hashed passwords
export const supabase = applyPasswordHashMiddleware(baseClient);
