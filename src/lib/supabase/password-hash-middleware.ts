import { SupabaseClient } from &ldquo;@supabase/supabase-js&rdquo;;

/**
 * This middleware extension allows the Supabase client to work with
 * client-side hashed passwords by modifying the auth calls.
 *
 * By applying this middleware, the server will understand that passwords
 * are already hashed and will handle them accordingly.
 */
export const applyPasswordHashMiddleware = (supabase: SupabaseClient) => {
  // Create a wrapper for the original fetch function
  const originalFetch = globalThis.fetch;

  // Override the global fetch to intercept Supabase auth requests
  globalThis.fetch = async (input, init) => {
    // Only modify Supabase auth endpoints for password-related operations
    const url = input instanceof Request ? input.url : input.toString();
    const isSupabaseAuthEndpoint =
      url.includes(&ldquo;/auth/v1&rdquo;) &&
      (url.includes(&ldquo;/signup&rdquo;) ||
        url.includes(&ldquo;/token&rdquo;) ||
        url.includes(&ldquo;/user&rdquo;));

    // Check if this is a password-related operation
    const body = init?.body ? JSON.parse(init.body.toString()) : null;
    const hasPassword = body && &ldquo;password&rdquo; in body;

    if (isSupabaseAuthEndpoint && hasPassword) {
      // Add the custom header to indicate password is pre-hashed
      init = {
        ...init,
        headers: {
          ...(init?.headers || {}),
          &ldquo;x-password-hashed&rdquo;: &ldquo;true&rdquo;,
        },
      };
    }

    // Call the original fetch with potentially modified headers
    return originalFetch(input, init);
  };

  return supabase;
};
