import { apiCall } from '@/lib/api';
import type { 
  Municipality, 
  CreateMunicipalityRequest, 
  UpdateMunicipalityRequest,
  MunicipalityAuthRequest,
  MunicipalityChangePasswordRequest
} from '@/types/municipality';

export class MunicipalityService {
  // Get public municipalities
  static async getPublicMunicipalities(): Promise<Municipality[]> {
    return await apiCall('/municipality/public');
  }

  // Get all municipalities (admin only)
  static async getAll(): Promise<Municipality[]> {
    console.log("🏛️ MunicipalityService.getAll - Making API call to /municipality");
    const response = await apiCall('/municipality');
    console.log("🏛️ MunicipalityService.getAll - Raw response:", response);
    // Handle the response format: { municipalities: [...] }
    const result = response.municipalities || response;
    console.log("🏛️ MunicipalityService.getAll - Processed result:", result);
    return result;
  }

  // Get municipality by ID
  static async getById(id: string): Promise<Municipality> {
    const response = await apiCall(`/municipality/${id}`);
    // Handle the response format: { municipality: {...} } or direct object
    return response.municipality || response;
  }

  // Create municipality
  static async create(data: CreateMunicipalityRequest): Promise<Municipality> {
    const response = await apiCall('/municipality', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle the response format: { municipality: {...} }
    return response.municipality || response;
  }

  // Update municipality
  static async update(id: string, data: UpdateMunicipalityRequest): Promise<Municipality> {
    const response = await apiCall(`/municipality/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    // Handle the response format: { municipality: {...} }
    return response.municipality || response;
  }

  // Delete municipality
  static async delete(id: string): Promise<void> {
    return await apiCall(`/municipality/${id}`, {
      method: 'DELETE',
    });
  }

  // Municipality authentication
  static async login(credentials: MunicipalityAuthRequest): Promise<any> {
    return await apiCall('/municipality/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Get current municipality
  static async getCurrentMunicipality(): Promise<Municipality> {
    return await apiCall('/municipality/me');
  }

  // Change municipality password
  static async changePassword(data: MunicipalityChangePasswordRequest): Promise<void> {
    return await apiCall('/municipality/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
} 