/**
 * Utility functions for password generation
 * Client-side only
 */

/**
 * Generate a secure random temporary password
 * @param length - Password length (default: 12)
 * @returns Random password string
 */
export function generateTempPassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""

  // Use crypto.getRandomValues for better randomness in browser
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      password += charset.charAt(array[i] % charset.length)
    }
  } else {
    // Fallback for SSR or environments without crypto
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
  }

  return password
}
