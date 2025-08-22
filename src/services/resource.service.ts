import { apiCall } from '@/lib/api';
import { Resource } from '@/types/api';

export class ResourceService {
  // Get all resources
  static async getAllResources(filters?: any) {
    try {
      console.log('🔍 ResourceService.getAllResources - Fetching resources with filters:', filters);

      const queryParams = new URLSearchParams();
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.municipalityId) queryParams.append('municipalityId', filters.municipalityId);

      const url = `/resource${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await apiCall(url);
    } catch (error) {
      console.error('❌ ResourceService.getAllResources - Error:', error);
      throw error;
    }
  }

  // Get user's resources
  static async getMyResources() {
    return await apiCall('/resource/my');
  }

  // Get specific resource
  static async getResource(id: string) {
    return await apiCall(`/resource/${id}`);
  }

  // Create resource (without file)
  static async createResource(data: any) {
    return await apiCall('/resource', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Upload resource with file
  static async uploadResource(formData: FormData) {
    try {
      console.log('🔍 ResourceService.uploadResource - Uploading resource with file');

      return await apiCall('/resource', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('❌ ResourceService.uploadResource - Error:', error);
      throw error;
    }
  }

  // Update resource
  static async updateResource(id: string, data: any) {
    return await apiCall(`/resource/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Delete resource
  static async deleteResource(id: string) {
    return await apiCall(`/resource/${id}`, {
      method: 'DELETE'
    });
  }

  // Download resource
  static async downloadResource(id: string) {
    return await apiCall(`/resource/${id}/download`, { method: 'POST' });
  }

  // Increment download count
  static async incrementDownloads(id: string) {
    return await apiCall(`/resource/${id}/downloads`, { method: 'POST' });
  }

  // Rate resource
  static async rateResource(id: string, rating: number) {
    return await apiCall(`/resource/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating })
    });
  }
} 