import { apiCall } from '@/lib/api';
import { Entrepreneurship } from '@/types/profile';

export class EntrepreneurshipService {
  // Get all public entrepreneurships
  static async getAllEntrepreneurships(filters?: any) {
    const queryParams = new URLSearchParams();
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.municipality) queryParams.append('municipality', filters.municipality);
    if (filters?.ownerId) queryParams.append('ownerId', filters.ownerId);
    if (filters?.isPublic !== undefined) queryParams.append('isPublic', filters.isPublic.toString());
    
    const url = `/api/entrepreneurship${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiCall(url);
  }

  // Get user's entrepreneurships
  static async getMyEntrepreneurships() {
    return await apiCall('/api/entrepreneurship?my=true');
  }

  // Get specific entrepreneurship
  static async getEntrepreneurship(id: string) {
    return await apiCall(`/api/entrepreneurship/${id}`);
  }

  // Create entrepreneurship
  static async createEntrepreneurship(data: any) {
    return await apiCall('/api/entrepreneurship', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Update entrepreneurship
  static async updateEntrepreneurship(id: string, data: any) {
    return await apiCall(`/api/entrepreneurship/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Delete entrepreneurship (soft delete)
  static async deleteEntrepreneurship(id: string) {
    return await apiCall(`/api/entrepreneurship/${id}`, {
      method: 'DELETE'
    });
  }

  // Increment view count
  static async incrementViews(id: string) {
    return await apiCall(`/api/entrepreneurship/${id}/views`, { method: 'POST' });
  }
} 