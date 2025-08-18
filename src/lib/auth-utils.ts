// Utilidades para manejo de autenticación
import { clearTokens } from './api';

/**
 * Limpia todos los datos de autenticación del localStorage
 */
export function clearAllAuthData() {
  console.log('🧹 clearAllAuthData - Clearing all authentication data');
  
  // Limpiar tokens usando la función existente
  clearTokens();
  
  // Limpiar cualquier otro dato relacionado con auth
  const keysToRemove = [
    'token',
    'refreshToken',
    'user',
    'auth',
    'session',
    'app-theme',
    'ui-theme'
  ];
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`🧹 clearAllAuthData - Removing ${key} from localStorage`);
      localStorage.removeItem(key);
    }
  });
  
  console.log('🧹 clearAllAuthData - All authentication data cleared');
}

/**
 * Verifica si el token existe y es válido
 */
export function isTokenValid(): boolean {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('🔍 isTokenValid - No token found');
    return false;
  }
  
  try {
    // Verificar que el token tenga el formato correcto (3 partes separadas por puntos)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('🔍 isTokenValid - Token format invalid (not 3 parts)');
      return false;
    }
    
    // Decodificar el payload para verificar la expiración
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      console.log('🔍 isTokenValid - Token expired');
      return false;
    }
    
    console.log('🔍 isTokenValid - Token appears valid');
    return true;
  } catch (error) {
    console.log('🔍 isTokenValid - Error validating token:', error);
    return false;
  }
}

/**
 * Fuerza el logout y redirección
 */
export function forceLogout() {
  console.log('🚪 forceLogout - Forcing logout');
  clearAllAuthData();
  
  // Redirigir a la página de login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
