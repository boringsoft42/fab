// Base API configuration and utilities
const API_BASE_DEV = process.env.NEXT_PUBLIC_API_BASE_DEV || "http://localhost:3001/api";
const API_BASE_PROD = process.env.NEXT_PUBLIC_API_BASE_PROD || "https://back-end-production-17b6.up.railway.app/api";

// Use development URL for now, switch based on environment
export const API_BASE = process.env.NODE_ENV === 'production' ? API_BASE_PROD : API_BASE_DEV;

// Backend URL configuration
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Flag to enable/disable backend calls
const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND !== 'false';

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
  localStorage.setItem("token", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// Function to decode JWT token and extract user information
export const decodeToken = (token: string): any => {
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
    id: decoded.id,
    role: decoded.role || decoded.type,
    municipalityId: decoded.id, // For municipalities, the ID is the municipality ID
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
    const response = await fetch(`${API_BASE}/auth/refresh`, {
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

// Central API call function with automatic token refresh
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Check if this is a local API route (starts with /auth/me or /municipality/auth/me)
    if (endpoint === "/auth/me" || endpoint === "/municipality/auth/me") {
      console.log("🔐 apiCall - Using local API route for:", endpoint);
      const authHeaders = getAuthHeaders();
      console.log("🔐 apiCall - Auth headers for local route:", authHeaders);

      const localEndpoint = endpoint === "/auth/me" ? "/api/auth/me" : "/api/municipality/auth/me";
      const response = await fetch(localEndpoint, {
        ...options,
        headers: {
          ...authHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    // If backend is disabled, return mock data
    if (!USE_BACKEND) {
      console.log("🔐 apiCall - Backend disabled, returning mock data for:", endpoint);
      return getMockData(endpoint);
    }

    // For other endpoints, use the backend
    // Check if body is FormData to exclude Content-Type header
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...getAuthHeaders(isFormData),
      ...options.headers
    };

    const fullUrl = `${API_BASE}${endpoint}`;

    console.log("🔐 apiCall - Starting request...");
    console.log("🔐 apiCall - API_BASE:", API_BASE);
    console.log("🔐 apiCall - endpoint:", endpoint);
    console.log("🔐 apiCall - Full URL:", fullUrl);
    console.log(
      "🔐 apiCall - Expected URL should be:",
      `${API_BASE}${endpoint}`
    );
    console.log("🔐 apiCall - Headers being sent:", headers);
    console.log("🔐 apiCall - Token present:", !!getToken());
    console.log("🔐 apiCall - Options:", options);

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
        const retryResponse = await fetch(fullUrl, {
          ...options,
          headers: {
            ...getAuthHeaders(isFormData),
            ...options.headers
          }
        });

        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }

        return await retryResponse.json();
      } catch (refreshError) {
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
  
  // Default mock response
  return {
    message: 'Mock data - Backend not available',
    endpoint,
    timestamp: new Date().toISOString()
  };
}; 