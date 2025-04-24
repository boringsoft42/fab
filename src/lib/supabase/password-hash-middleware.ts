import { SupabaseClient } from "@supabase/supabase-js";

/**
 * This middleware extension allows the Supabase client to work with
 * client-side hashed passwords by modifying the auth calls.
 *
 * By applying this middleware, the server will understand that passwords
 * are already hashed and will handle them accordingly.
 */
export const applyPasswordHashMiddleware = (supabase: SupabaseClient) => {
  // Store original methods to be wrapped
  const originalSignIn = supabase.auth.signInWithPassword;
  const originalSignUp = supabase.auth.signUp;
  const originalUpdateUser = supabase.auth.updateUser;

  // Override sign in with password method
  supabase.auth.signInWithPassword = async (params) => {
    // Add a custom header to indicate the password is pre-hashed
    const customHeaders = {
      "x-password-hashed": "true",
    };

    // Call the original method with the additional header
    return originalSignIn.call(supabase.auth, params, {
      headers: customHeaders,
    });
  };

  // Override sign up method
  supabase.auth.signUp = async (params, options) => {
    // Add a custom header to indicate the password is pre-hashed
    const customHeaders = {
      "x-password-hashed": "true",
    };

    // Merge with existing options if any
    const mergedOptions = {
      ...options,
      headers: {
        ...(options?.headers || {}),
        ...customHeaders,
      },
    };

    // Call the original method with the additional header
    return originalSignUp.call(supabase.auth, params, mergedOptions);
  };

  // Override update user method (for password reset)
  supabase.auth.updateUser = async (attributes) => {
    // If the update contains a password, add the custom header
    if ("password" in attributes) {
      // Add a custom header to indicate the password is pre-hashed
      const customHeaders = {
        "x-password-hashed": "true",
      };

      // Call the original method with the additional header
      return originalUpdateUser.call(supabase.auth, attributes, {
        headers: customHeaders,
      });
    }

    // Otherwise, just call the original method
    return originalUpdateUser.call(supabase.auth, attributes);
  };

  return supabase;
};
