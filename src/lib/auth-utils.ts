/**
 * Limpia todos los datos de autenticación del localStorage y cookies
 */
export function clearAllAuthData() {
  console.log('🧹 clearAllAuthData - Clearing all authentication data');
  
  // Clear localStorage data
  const keysToRemove = [
    'token',
    'refreshToken', 
    'user',
    'auth',
    'session',
    'mockUser',
    'mock-companies-data',
    'userProfile',
    'app-theme',
    'ui-theme',
    'enable-mock-auth'
  ];
  
  keysToRemove.forEach(key => {
    if (typeof window !== 'undefined' && localStorage.getItem(key)) {
      console.log(`🧹 clearAllAuthData - Removing ${key} from localStorage`);
      localStorage.removeItem(key);
    }
  });
  
  // Clear all keys that start with 'mock-' or 'cemse-'
  if (typeof window !== 'undefined') {
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('mock-') || key.startsWith('cemse-')) {
        console.log(`🧹 clearAllAuthData - Removing mock/app data: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }
  
  // Clear authentication cookies (client-side cleanup)
  if (typeof window !== 'undefined') {
    // Clear new auth cookies
    document.cookie = 'cemse-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;';
    document.cookie = 'cemse-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;';
    
    // Clear legacy cookies if they exist
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;';
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;';
    
    console.log('🧹 clearAllAuthData - Authentication cookies cleared');
    
    // Mark recent logout to prevent auto-login
    sessionStorage.setItem('recent-logout', Date.now().toString());
    document.cookie = `recent-logout=${Date.now()}; path=/; max-age=30; SameSite=Lax`;
  }
  
  console.log('🧹 clearAllAuthData - All authentication data cleared');
}

/**
 * Cookie-based authentication - token validation handled server-side
 * This function is kept for compatibility but always returns false since
 * we can't access httpOnly cookies from client-side JavaScript
 */
export function isTokenValid(): boolean {
  console.log('🔍 isTokenValid - Cookie-based auth: tokens are httpOnly and not accessible from client');
  return false;
}

/**
 * Fuerza el logout y redirección
 */
export function forceLogout() {
  console.log('🚪 forceLogout - Forcing logout');
  clearAllAuthData();
  
  // Redirigir a la página principal
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}
