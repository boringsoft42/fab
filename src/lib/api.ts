// Base API configuration and utilities
const API_BASE_DEV = process.env.NEXT_PUBLIC_API_BASE_DEV || "http://192.168.10.91:3001/api";
const API_BASE_PROD = process.env.NEXT_PUBLIC_API_BASE_PROD || "https://back-end-production-17b6.up.railway.app/api";

// Use development URL for now, switch based on environment
export const API_BASE = process.env.NODE_ENV === 'production' ? API_BASE_PROD : API_BASE_DEV;

// Backend URL configuration - ensure it matches the API_BASE without /api suffix
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.10.91:3001";

// Utility function to make direct backend calls
export const backendCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  console.log('🔍 backendCall - Making request to:', url);

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Token management
export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
};

// Function to decode JWT token and extract user information
export const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Function to get user info from token
export const getUserFromToken = (): {
  id?: string;
  role?: string;
  municipalityId?: string;
} | null => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded.id as string,
    role: (decoded.role || decoded.type) as string,
    municipalityId: decoded.id as string, // For municipalities, the ID is the municipality ID
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  console.log("🔐 isAuthenticated - Token exists:", !!token);
  return !!token;
};

// Get authentication headers
export const getAuthHeaders = (excludeContentType = false) => {
  const token = getToken();
  console.log("🔐 getAuthHeaders - Token exists:", !!token);
  console.log(
    "🔐 getAuthHeaders - Token value:",
    token ? `${token.substring(0, 20)}...` : "null"
  );
  console.log("🔐 getAuthHeaders - Full token:", token);

  const headers: Record<string, string> = {};

  // Only add Content-Type if not excluded (for FormData)
  if (!excludeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log("🔐 getAuthHeaders - Final headers:", headers);
  console.log(
    "🔐 getAuthHeaders - Authorization header:",
    headers.Authorization
  );
  return headers;
};

// Refresh token function
export const refreshToken = async () => {
  const refreshTokenValue = getRefreshToken();
  if (!refreshTokenValue) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    setTokens(data.token, data.refreshToken);
    return data.token;
  } catch (error) {
    clearTokens();
    // Don't redirect automatically, let the calling code handle it
    throw error;
  }
};

// Enhanced API call function with better error handling
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> => {
  try {
    // Always get fresh auth headers
    const authHeaders = getAuthHeaders(options.body instanceof FormData);

    // Ensure we have a token for protected endpoints
    const token = getToken();
    const isProtectedEndpoint = !endpoint.includes('/auth/login') &&
      !endpoint.includes('/auth/register') &&
      !endpoint.includes('/public');

    if (isProtectedEndpoint && !token) {
      console.error('🔐 apiCall - No token available for protected endpoint:', endpoint);
      throw new Error('Authentication required');
    }

    const headers = {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers
    };

    const fullUrl = `${API_BASE}${endpoint}`;

    console.log("🔐 apiCall - Starting request...");
    console.log("🔐 apiCall - API_BASE:", API_BASE);
    console.log("🔐 apiCall - endpoint:", endpoint);
    console.log("🔐 apiCall - Full URL:", fullUrl);
    console.log("🔐 apiCall - Auth headers from getAuthHeaders:", authHeaders);
    console.log("🔐 apiCall - Options headers:", options.headers);
    console.log("🔐 apiCall - Final headers being sent:", headers);
    console.log("🔐 apiCall - Authorization header in final headers:", (headers as Record<string, string>).Authorization);
    console.log("🔐 apiCall - Token present:", !!token);
    console.log("🔐 apiCall - Is protected endpoint:", isProtectedEndpoint);

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log("🔐 apiCall - Response status:", response.status);
    console.log("🔐 apiCall - Response URL:", response.url);

    if (response.status === 401) {
      console.log("🔐 apiCall - Received 401, attempting token refresh");
      // Try to refresh token
      try {
        await refreshToken();
        // Retry the original request with new token
        const newAuthHeaders = getAuthHeaders(options.body instanceof FormData);
        const retryResponse = await fetch(fullUrl, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...newAuthHeaders,
            ...options.headers
          }
        });

        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }

        return await retryResponse.json();
      } catch {
        // Refresh failed, clear tokens but don't redirect automatically
        clearTokens();
        throw new Error("Authentication failed");
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);

    // If backend is not available, return mock data
    if (error instanceof Error && error.message.includes('fetch failed')) {
      console.log("🔐 apiCall - Backend not available, returning mock data for:", endpoint);
      return getMockData(endpoint);
    }

    throw error;
  }
};

// Mock data function
const getMockData = (endpoint: string) => {
  console.log("🔐 getMockData - Generating mock data for:", endpoint);

  // Mock data for different endpoints
  if (endpoint.includes('/joboffer')) {
    return {
      jobOffers: [
        {
          id: '1',
          title: 'Desarrollador Frontend',
          company: 'TechCorp',
          location: 'Buenos Aires',
          salary: '$3000 - $5000',
          description: 'Buscamos un desarrollador frontend con experiencia en React',
          requirements: ['React', 'TypeScript', '3+ años de experiencia'],
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          title: 'Diseñador UX/UI',
          company: 'DesignStudio',
          location: 'Córdoba',
          salary: '$2500 - $4000',
          description: 'Diseñador creativo para proyectos digitales',
          requirements: ['Figma', 'Adobe Creative Suite', '2+ años de experiencia'],
          createdAt: new Date().toISOString(),
          status: 'active'
        }
      ]
    };
  }

  if (endpoint.includes('/company')) {
    // Mock data for company statistics
    if (endpoint.includes('/company/stats')) {
      return {
        totalCompanies: 3,
        activeCompanies: 3,
        pendingCompanies: 0,
        inactiveCompanies: 0,
        totalEmployees: 45,
        totalRevenue: 1250000
      };
    }

    // Mock data for company search by municipality
    if (endpoint.includes('/company/search')) {
      const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
      const municipalityId = urlParams.get('municipalityId');

      console.log("🔍 getMockData - Company search by municipality:", municipalityId);

      // Return companies based on municipality
      const companies = [
        {
          id: '1',
          name: 'TechCorp Innovación',
          description: 'Empresa de tecnología innovadora especializada en desarrollo de software',
          businessSector: 'Tecnología',
          companySize: 'MEDIUM',
          foundedYear: 2020,
          website: 'https://techcorp.com',
          email: 'contacto@techcorp.com',
          phone: '+591 2 1234567',
          address: 'Av. Principal 123',
          isActive: true,
          municipality: {
            id: municipalityId || '1',
            name: 'Cercado',
            department: 'La Paz'
          },
          creator: {
            id: 'user_1',
            firstName: 'Juan',
            lastName: 'Pérez',
            role: 'ADMIN'
          },
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'DesignStudio Creativo',
          description: 'Estudio de diseño creativo para proyectos digitales',
          businessSector: 'Diseño',
          companySize: 'SMALL',
          foundedYear: 2021,
          website: 'https://designstudio.com',
          email: 'info@designstudio.com',
          phone: '+591 2 7654321',
          address: 'Calle Comercial 456',
          isActive: true,
          municipality: {
            id: municipalityId || '1',
            name: 'Cercado',
            department: 'La Paz'
          },
          creator: {
            id: 'user_2',
            firstName: 'María',
            lastName: 'García',
            role: 'ADMIN'
          },
          createdAt: '2024-02-20T14:30:00Z',
          updatedAt: '2024-02-20T14:30:00Z'
        },
        {
          id: '3',
          name: 'Consultoría Empresarial ABC',
          description: 'Servicios de consultoría empresarial y asesoría financiera',
          businessSector: 'Consultoría',
          companySize: 'MICRO',
          foundedYear: 2022,
          website: 'https://consultoriaabc.com',
          email: 'asesoria@consultoriaabc.com',
          phone: '+591 2 9876543',
          address: 'Plaza Mayor 789',
          isActive: true,
          municipality: {
            id: municipalityId || '1',
            name: 'Cercado',
            department: 'La Paz'
          },
          creator: {
            id: 'user_3',
            firstName: 'Carlos',
            lastName: 'López',
            role: 'ADMIN'
          },
          createdAt: '2024-03-10T09:15:00Z',
          updatedAt: '2024-03-10T09:15:00Z'
        }
      ];

      return companies;
    }

    // Mock data for general company endpoints
    return {
      companies: [
        {
          id: '1',
          name: 'TechCorp',
          description: 'Empresa de tecnología innovadora',
          location: 'Buenos Aires',
          industry: 'Tecnología'
        },
        {
          id: '2',
          name: 'DesignStudio',
          description: 'Estudio de diseño creativo',
          location: 'Córdoba',
          industry: 'Diseño'
        }
      ]
    };
  }

  if (endpoint.includes('/course')) {
    return {
      courses: [
        {
          id: '1',
          title: 'React para Principiantes',
          description: 'Aprende React desde cero',
          duration: '8 semanas',
          instructor: 'Juan Pérez'
        },
        {
          id: '2',
          title: 'Diseño UX/UI',
          description: 'Fundamentos del diseño de experiencia de usuario',
          duration: '6 semanas',
          instructor: 'María García'
        }
      ]
    };
  }

  if (endpoint.includes('/certificate') && !endpoint.includes('/certificate/')) {
    return [
      {
        id: 'cert_1',
        userId: 'user_123',
        courseId: 'course_1',
        template: 'default',
        issuedAt: '2024-01-15T10:00:00Z',
        verificationCode: 'CERT-2024-001',
        digitalSignature: 'sha256-signature-1',
        isValid: true,
        url: 'https://example.com/certificates/course-cert-1.pdf',
        course: {
          id: 'course_1',
          title: 'Desarrollo Web Completo',
          description: 'Curso completo de desarrollo web con HTML, CSS y JavaScript'
        },
        user: {
          id: 'user_123',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        }
      },
      {
        id: 'cert_2',
        userId: 'user_123',
        courseId: 'course_2',
        template: 'premium',
        issuedAt: '2024-02-20T14:30:00Z',
        verificationCode: 'CERT-2024-002',
        digitalSignature: 'sha256-signature-2',
        isValid: true,
        url: 'https://example.com/certificates/course-cert-2.pdf',
        course: {
          id: 'course_2',
          title: 'React Avanzado',
          description: 'Aprende React desde cero hasta nivel avanzado'
        },
        user: {
          id: 'user_123',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        }
      }
    ];
  }

  if (endpoint.includes('/modulecertificate') && !endpoint.includes('/modulecertificate/')) {
    return [
      {
        id: 'module_cert_1',
        moduleId: 'module_1',
        studentId: 'user_123',
        certificateUrl: 'https://example.com/certificates/module-cert-1.pdf',
        issuedAt: '2024-01-10T09:00:00Z',
        grade: 95,
        completedAt: '2024-01-10T08:45:00Z',
        module: {
          id: 'module_1',
          title: 'Fundamentos de HTML',
          course: {
            id: 'course_1',
            title: 'Desarrollo Web Completo'
          }
        },
        student: {
          id: 'user_123',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com'
        }
      },
      {
        id: 'module_cert_2',
        moduleId: 'module_2',
        studentId: 'user_123',
        certificateUrl: 'https://example.com/certificates/module-cert-2.pdf',
        issuedAt: '2024-01-25T11:30:00Z',
        grade: 88,
        completedAt: '2024-01-25T11:15:00Z',
        module: {
          id: 'module_2',
          title: 'CSS y Estilos',
          course: {
            id: 'course_1',
            title: 'Desarrollo Web Completo'
          }
        },
        student: {
          id: 'user_123',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com'
        }
      },
      {
        id: 'module_cert_3',
        moduleId: 'module_3',
        studentId: 'user_123',
        certificateUrl: 'https://example.com/certificates/module-cert-3.pdf',
        issuedAt: '2024-02-05T16:20:00Z',
        grade: 92,
        completedAt: '2024-02-05T16:05:00Z',
        module: {
          id: 'module_3',
          title: 'JavaScript Básico',
          course: {
            id: 'course_1',
            title: 'Desarrollo Web Completo'
          }
        },
        student: {
          id: 'user_123',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com'
        }
      }
    ];
  }

  if (endpoint.includes('/course-enrollments')) {
    return [
      {
        id: 'enrollment_1',
        courseId: 'course_1',
        userId: 'user_123',
        status: 'IN_PROGRESS',
        progress: 65,
        enrolledAt: '2024-01-15T10:00:00Z',
        course: {
          id: 'course_1',
          title: 'Desarrollo Web Completo'
        }
      },
      {
        id: 'enrollment_2',
        courseId: 'course_2',
        userId: 'user_123',
        status: 'COMPLETED',
        progress: 100,
        enrolledAt: '2024-01-20T14:30:00Z',
        completedAt: '2024-02-15T16:45:00Z',
        course: {
          id: 'course_2',
          title: 'React Avanzado'
        }
      },
      {
        id: 'enrollment_3',
        courseId: 'course_3',
        userId: 'user_123',
        status: 'PENDING',
        progress: 0,
        enrolledAt: '2024-02-01T09:15:00Z',
        course: {
          id: 'course_3',
          title: 'Diseño UX/UI'
        }
      }
    ];
  }

  // Endpoints específicos de certificados
  if (endpoint.includes('/modulecertificate/') && !endpoint.includes('/verify/')) {
    const certificateId = endpoint.split('/').pop();
    return {
      id: certificateId,
      moduleId: 'module_1',
      studentId: 'user_123',
      certificateUrl: 'https://example.com/certificates/module-cert-1.pdf',
      issuedAt: '2024-01-10T09:00:00Z',
      grade: 95,
      completedAt: '2024-01-10T08:45:00Z',
      module: {
        id: 'module_1',
        title: 'Fundamentos de HTML',
        course: {
          id: 'course_1',
          title: 'Desarrollo Web Completo'
        }
      },
      student: {
        id: 'user_123',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      }
    };
  }

  if (endpoint.includes('/certificate/') && !endpoint.includes('/verify/')) {
    const certificateId = endpoint.split('/').pop();
    return {
      id: certificateId,
      userId: 'user_123',
      courseId: 'course_1',
      template: 'default',
      issuedAt: '2024-01-15T10:00:00Z',
      verificationCode: 'CERT-2024-001',
      digitalSignature: 'sha256-signature-1',
      isValid: true,
      url: 'https://example.com/certificates/course-cert-1.pdf',
      course: {
        id: 'course_1',
        title: 'Desarrollo Web Completo',
        description: 'Curso completo de desarrollo web con HTML, CSS y JavaScript'
      },
      user: {
        id: 'user_123',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com'
      }
    };
  }

  if (endpoint.includes('/certificate/verify/')) {
    const verificationCode = endpoint.split('/').pop();
    return {
      isValid: true,
      certificate: {
        id: 'cert_1',
        verificationCode: verificationCode,
        course: {
          title: 'Desarrollo Web Completo'
        },
        user: {
          firstName: 'Juan',
          lastName: 'Pérez'
        },
        issuedAt: '2024-01-15T10:00:00Z'
      }
    };
  }

  // Mock data for authentication endpoints
  if (endpoint.includes('/auth/me')) {
    return {
      id: 'user_1',
      username: 'admin_municipio',
      firstName: 'Administrador',
      lastName: 'Municipio',
      email: 'admin@cercado.gob.bo',
      role: 'GOBIERNOS_MUNICIPALES',
      municipalityId: '1',
      profilePicture: 'https://ui-avatars.com/api/?name=Admin+Municipio&background=random',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
  }

  // Mock data for municipality endpoints
  if (endpoint.includes('/municipality/auth/me')) {
    return {
      id: '1',
      name: 'Cercado',
      department: 'La Paz',
      region: 'Altiplano',
      population: 850000,
      mayor: 'Dr. Juan Pérez',
      mayorEmail: 'alcalde@cercado.gob.bo',
      mayorPhone: '+591 2 1234567',
      address: 'Plaza Mayor 1',
      website: 'https://cercado.gob.bo',
      email: 'info@cercado.gob.bo',
      phone: '+591 2 7654321',
      logo: 'https://ui-avatars.com/api/?name=Cercado&background=random',
      coverImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
      description: 'Municipio de Cercado, La Paz - Bolivia',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
  }

  if (endpoint.includes('/municipality')) {
    return [
      {
        id: '1',
        name: 'Cercado',
        department: 'La Paz',
        region: 'Altiplano',
        population: 850000,
        mayor: 'Dr. Juan Pérez',
        mayorEmail: 'alcalde@cercado.gob.bo',
        mayorPhone: '+591 2 1234567',
        address: 'Plaza Mayor 1',
        website: 'https://cercado.gob.bo',
        email: 'info@cercado.gob.bo',
        phone: '+591 2 7654321',
        logo: 'https://ui-avatars.com/api/?name=Cercado&background=random',
        coverImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
        description: 'Municipio de Cercado, La Paz - Bolivia',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'El Alto',
        department: 'La Paz',
        region: 'Altiplano',
        population: 1200000,
        mayor: 'Dra. María García',
        mayorEmail: 'alcalde@elalto.gob.bo',
        mayorPhone: '+591 2 9876543',
        address: 'Av. Principal 100',
        website: 'https://elalto.gob.bo',
        email: 'info@elalto.gob.bo',
        phone: '+591 2 4567890',
        logo: 'https://ui-avatars.com/api/?name=El+Alto&background=random',
        coverImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
        description: 'Municipio de El Alto, La Paz - Bolivia',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  // Default mock response
  return {
    message: 'Mock data - Backend not available',
    endpoint,
    timestamp: new Date().toISOString()
  };
}; 