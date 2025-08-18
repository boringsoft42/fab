import { apiCall } from '@/lib/api';
import type { 
  Municipality, 
  CreateMunicipalityRequest, 
  UpdateMunicipalityRequest,
  MunicipalityAuthRequest,
  MunicipalityAuthResponse,
  MunicipalityChangePasswordRequest
} from '@/types/municipality';

export class MunicipalityService {
  /**
   * Get all municipalities
   */
  static async getAll(): Promise<Municipality[]> {
    return apiCall('/municipality');
  }

  /**
   * Get municipality by ID
   */
  static async getById(id: string): Promise<Municipality> {
    return apiCall(`/municipality/${id}`);
  }

  /**
   * Create new municipality
   */
  static async create(data: CreateMunicipalityRequest): Promise<Municipality> {
    return apiCall('/municipality', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Update municipality
   */
  static async update(id: string, data: UpdateMunicipalityRequest): Promise<Municipality> {
    return apiCall(`/municipality/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete municipality
   */
  static async delete(id: string): Promise<void> {
    return apiCall(`/municipality/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Municipality authentication
   */
  static async login(credentials: MunicipalityAuthRequest): Promise<MunicipalityAuthResponse> {
    return apiCall('/municipality/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  /**
   * Get current municipality profile
   */
  static async getCurrentMunicipality(): Promise<Municipality> {
    return apiCall('/municipality/auth/me');
  }

  /**
   * Change municipality password
   */
  static async changePassword(data: MunicipalityChangePasswordRequest): Promise<{ message: string }> {
    return apiCall('/municipality/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
} 