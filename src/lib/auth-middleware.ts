import { NextRequest } from 'next/server';
import { User } from '@/types/api';

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface OrganizationResult {
  success: boolean;
  message?: string;
}

// Middleware para autenticación de token
export async function authenticateToken(request: NextRequest): Promise<AuthResult> {
  try {
    console.log('🔐 authenticateToken - Iniciando validación');
    const authHeader = request.headers.get('authorization');
    console.log('🔐 authenticateToken - Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔐 authenticateToken - Header inválido o faltante');
      return {
        success: false,
        message: 'Authorization header missing or invalid'
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🔐 authenticateToken - Token extraído:', token ? `${token.substring(0, 20)}...` : 'null');
    
    // Aquí deberías validar el token con tu backend
    // Por ahora, simulamos la validación
    const user = await validateToken(token);
    console.log('🔐 authenticateToken - Usuario validado:', user);
    
    if (!user) {
      console.log('🔐 authenticateToken - Token inválido o expirado');
      return {
        success: false,
        message: 'Invalid or expired token'
      };
    }

    console.log('🔐 authenticateToken - Autenticación exitosa');
    return {
      success: true,
      user,
      token
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: 'Authentication failed'
    };
  }
}

// Middleware para requerir permisos de organización
export async function requireOrganization(request: NextRequest): Promise<OrganizationResult> {
  try {
    const authResult = await authenticateToken(request);
    
    if (!authResult.success || !authResult.user) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const user = authResult.user;
    const allowedRoles = [
      'SUPERADMIN', 
      'EMPRESAS', 
      'GOBIERNOS_MUNICIPALES', 
      'CENTROS_DE_FORMACION', 
      'ONGS_Y_FUNDACIONES'
    ];
    
    const allowedTypes = ['municipality', 'company'];

    const hasValidRole = user.role && allowedRoles.includes(user.role);
    const hasValidType = user.type && allowedTypes.includes(user.type);

    if (!hasValidRole && !hasValidType) {
      return {
        success: false,
        message: 'Organization permissions required'
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Organization permission check error:', error);
    return {
      success: false,
      message: 'Permission check failed'
    };
  }
}

// Middleware para requerir permisos de SuperAdmin
export async function requireSuperAdmin(request: NextRequest): Promise<OrganizationResult> {
  try {
    const authResult = await authenticateToken(request);
    
    if (!authResult.success || !authResult.user) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const user = authResult.user;
    
    if (user.role !== 'SUPERADMIN') {
      return {
        success: false,
        message: 'SuperAdmin permissions required'
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('SuperAdmin permission check error:', error);
    return {
      success: false,
      message: 'Permission check failed'
    };
  }
}

// Función para validar token (simulada)
async function validateToken(token: string): Promise<User | null> {
  try {
    // Decodificar el token JWT para obtener información del usuario
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    
    // Crear un objeto User básico desde el token decodificado
    const user: User = {
      id: decoded.id || decoded.sub,
      username: decoded.username || decoded.email,
      email: decoded.email,
      role: decoded.role || decoded.type,
      type: decoded.type,
      firstName: decoded.firstName || decoded.given_name,
      lastName: decoded.lastName || decoded.family_name,
      // Agregar otros campos según sea necesario
    };
    
    return user;

  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}
