import { apiCall, setTokens, clearTokens, API_BASE, getToken, getAuthHeaders } from '@/lib/api';
import { LoginRequest, RegisterRequest, LoginResponse, User } from '@/types/api';

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('Attempting login to:', `${API_BASE}/auth/login`);
    console.log('Credentials:', { username: credentials.username, password: '***' });
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Login failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Login successful, received data:', { 
        token: data.token ? 'present' : 'missing',
        refreshToken: data.refreshToken ? 'present' : 'missing',
        role: data.role,
        user: data.user ? 'present' : 'missing',
        municipality: data.municipality ? 'present' : 'missing',
        company: data.company ? 'present' : 'missing',
        type: data.type,
        fullResponse: data
      });
      
      // Log municipality details if present
      if (data.municipality) {
        console.log('🔐 Municipality data:', {
          id: data.municipality.id,
          name: data.municipality.name,
          type: data.municipality.type,
          username: data.municipality.username,
          email: data.municipality.email
        });
      }
      
      // Log company details if present
      if (data.company) {
        console.log('🔐 Company data:', {
          id: data.company.id,
          name: data.company.name,
          type: data.type,
          username: data.company.username,
          email: data.company.email,
          businessSector: data.company.businessSector
        });
      }
      
      // Store tokens
      if (data.token) {
        console.log('🔐 Login - Storing token');
        console.log('🔐 Login - Token to store:', data.token ? `${data.token.substring(0, 20)}...` : 'null');
        // Use the same token as refresh token if not provided
        const refreshToken = data.refreshToken || data.token;
        setTokens(data.token, refreshToken);
        console.log('🔐 Login - Tokens stored, verifying...');
        console.log('🔐 Login - Stored token:', getToken());
        console.log('🔐 Login - Token verification successful');
      } else {
        console.warn('Missing token in login response');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose en http://localhost:3001');
      }
      throw error;
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<{ message: string }> {
    console.log('Attempting registration to:', `${API_BASE}/auth/register`);
    
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      console.log('Registration response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Registration failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Registration successful');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose en http://localhost:3001');
      }
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<{ user: User }> {
    try {
      console.log('🔍 getCurrentUser - Starting request to:', `${API_BASE}/auth/me`);
      console.log('🔍 getCurrentUser - Token before request:', getToken());
      console.log('🔍 getCurrentUser - Auth headers:', getAuthHeaders());
      
      const result = await apiCall('/auth/me');
      console.log('Current user retrieved successfully');
      console.log('🔍 getCurrentUser - Raw result:', result);
      console.log('🔍 getCurrentUser - User object:', result.user);
      console.log('🔍 getCurrentUser - User role:', result.user?.role);
      console.log('🔍 getCurrentUser - User role type:', typeof result.user?.role);
      return result;
    } catch (error) {
      console.error('🔍 getCurrentUser - Failed to get current user:', error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('🔍 getCurrentUser - Error message:', error.message);
        console.error('🔍 getCurrentUser - Error stack:', error.stack);
      }
      
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      console.log('Attempting logout');
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiCall('/auth/logout', { 
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        });
        console.log('Logout successful');
      } else {
        console.log('No refresh token found, skipping logout request');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      console.log('Tokens cleared');
    }
  }
} 