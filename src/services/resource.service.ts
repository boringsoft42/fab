import { apiCall } from '@/lib/api';
import { Resource } from '@/types/api';

export class ResourceService {
  static async getAll(): Promise<Resource[]> {
    return await apiCall('/resources');
  }

  static async getById(id: string): Promise<Resource> {
    return await apiCall(`/resources/${id}`);
  }

  static async create(data: Partial<Resource>): Promise<Resource> {
    return await apiCall('/resources', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<Resource>): Promise<Resource> {
    return await apiCall(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/resources/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para resources
  static async getByType(type: string): Promise<Resource[]> {
    return await apiCall(`/resources?type=${encodeURIComponent(type)}`);
  }

  static async getByCategory(category: string): Promise<Resource[]> {
    return await apiCall(`/resources?category=${encodeURIComponent(category)}`);
  }

  static async getPublicResources(): Promise<Resource[]> {
    return await apiCall('/resources?isPublic=true');
  }

  static async getFeaturedResources(): Promise<Resource[]> {
    return await apiCall('/resources?featured=true');
  }

  static async searchResources(query: string): Promise<Resource[]> {
    return await apiCall(`/resources/search?q=${encodeURIComponent(query)}`);
  }

  static async getResourcesByAuthor(authorId: string): Promise<Resource[]> {
    return await apiCall(`/resources?authorId=${authorId}`);
  }

  static async getPopularResources(limit: number = 10): Promise<Resource[]> {
    return await apiCall(`/resources/popular?limit=${limit}`);
  }

  static async getRecentResources(limit: number = 10): Promise<Resource[]> {
    return await apiCall(`/resources/recent?limit=${limit}`);
  }

  static async downloadResource(id: string): Promise<Blob> {
    return await apiCall(`/resources/${id}/download`, {
      responseType: 'blob'
    });
  }

  static async incrementDownloads(id: string): Promise<Resource> {
    return await apiCall(`/resources/${id}/download`, { method: 'POST' });
  }

  static async rateResource(id: string, rating: number): Promise<Resource> {
    return await apiCall(`/resources/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating })
    });
  }

  static async togglePublic(id: string): Promise<Resource> {
    return await apiCall(`/resources/${id}/toggle-public`, { method: 'POST' });
  }

  static async getResourceStats(id: string): Promise<{
    totalDownloads: number;
    averageRating: number;
    totalRatings: number;
    views: number;
    shares: number;
  }> {
    return await apiCall(`/resources/${id}/stats`);
  }

  static async getResourceCategories(): Promise<{
    category: string;
    count: number;
  }[]> {
    return await apiCall('/resources/categories');
  }

  static async getResourceTypes(): Promise<{
    type: string;
    count: number;
  }[]> {
    return await apiCall('/resources/types');
  }

  static async bulkUpdateResources(resourceIds: string[], updates: Partial<Resource>): Promise<Resource[]> {
    return await apiCall('/resources/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ resourceIds, updates })
    });
  }

  static async bulkDeleteResources(resourceIds: string[]): Promise<void> {
    return await apiCall('/resources/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ resourceIds })
    });
  }

  static async exportResources(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    return await apiCall(`/resources/export?format=${format}`, {
      responseType: 'blob'
    });
  }

  static async importResources(resources: Partial<Resource>[], format: 'json' | 'csv' = 'json'): Promise<Resource[]> {
    return await apiCall('/resources/import', {
      method: 'POST',
      body: JSON.stringify({ resources, format })
    });
  }
} 