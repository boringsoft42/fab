import { NextRequest } from 'next/server';
import { User } from '@/types/api';

export interface AuthResult {
  success: boolean;
  user?: User;
  message?: string;
}

export interface OrganizationResult {
  success: boolean;
  message?: string;
}

// Middleware para autenticación de token
export async function authenticateToken(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        message: 'Authorization header missing or invalid'
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Aquí deberías validar el token con tu backend
    // Por ahora, simulamos la validación
    const user = await validateToken(token);
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired token'
      };
    }

    return {
      success: true,
      user
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
    // Aquí deberías hacer una llamada a tu backend para validar el token
    // Por ahora, simulamos la validación
    
    // Simular una llamada al backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;

  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}
