import { apiCall, BACKEND_URL } from '@/lib/api';
import { Entrepreneurship } from '@/types/profile';

export class EntrepreneurshipService {
  // Get all public entrepreneurships
  static async getAllEntrepreneurships(filters?: any) {
    try {
      console.log('🔍 EntrepreneurshipService.getAllEntrepreneurships - Fetching entrepreneurships with filters:', filters);
      
      // If no filters or only public filters, use the public endpoint directly
      const hasPrivateFilters = filters?.ownerId || filters?.isPublic === false;
      
      if (!hasPrivateFilters) {
        console.log('🔍 EntrepreneurshipService.getAllEntrepreneurships - Using public endpoint directly');
        return await this.getPublicEntrepreneurships();
      }
      
      // For private filters, use the authenticated endpoint
      const queryParams = new URLSearchParams();
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.municipality) queryParams.append('municipality', filters.municipality);
      if (filters?.ownerId) queryParams.append('ownerId', filters.ownerId);
      if (filters?.isPublic !== undefined) queryParams.append('isPublic', filters.isPublic.toString());
      
      const url = `/entrepreneurship${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await apiCall(url);
    } catch (error) {
      console.error('❌ EntrepreneurshipService.getAllEntrepreneurships - Error:', error);
      throw error;
    }
  }

  // Get public entrepreneurships specifically
  static async getPublicEntrepreneurships() {
    try {
      console.log('🔍 EntrepreneurshipService.getPublicEntrepreneurships - Fetching public entrepreneurships');
      
      const response = await fetch(`${BACKEND_URL}/api/entrepreneurship/public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ EntrepreneurshipService.getPublicEntrepreneurships - Success:', data);
      return data;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.getPublicEntrepreneurships - Error:', error);
      throw error;
    }
  }

  // Get user's entrepreneurships
  static async getMyEntrepreneurships() {
    return await apiCall('/entrepreneurship/my');
  }

  // Get specific entrepreneurship
  static async getEntrepreneurship(id: string) {
    return await apiCall(`/entrepreneurship/${id}`);
  }

  // Create entrepreneurship
  static async createEntrepreneurship(data: any) {
    return await apiCall('/entrepreneurship', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Update entrepreneurship
  static async updateEntrepreneurship(id: string, data: any) {
    return await apiCall(`/entrepreneurship/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Delete entrepreneurship (soft delete)
  static async deleteEntrepreneurship(id: string) {
    return await apiCall(`/entrepreneurship/${id}`, {
      method: 'DELETE'
    });
  }

  // Increment view count
  static async incrementViews(id: string) {
    return await apiCall(`/entrepreneurship/${id}/views`, { method: 'POST' });
  }

  // Get entrepreneurships by owner
  static async getByOwner(ownerId: string) {
    return await apiCall(`/entrepreneurship?ownerId=${ownerId}`);
  }

  // Get entrepreneurships by category
  static async getByCategory(category: string) {
    try {
      console.log('🔍 EntrepreneurshipService.getByCategory - Fetching entrepreneurships by category:', category);
      
      const response = await fetch(`${BACKEND_URL}/api/entrepreneurship?category=${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ EntrepreneurshipService.getByCategory - Success:', data);
      return data;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.getByCategory - Error:', error);
      throw error;
    }
  }

  // Get entrepreneurships by municipality
  static async getByMunicipality(municipality: string) {
    try {
      console.log('🔍 EntrepreneurshipService.getByMunicipality - Fetching entrepreneurships by municipality:', municipality);
      
      const response = await fetch(`${BACKEND_URL}/api/entrepreneurship?municipality=${municipality}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ EntrepreneurshipService.getByMunicipality - Success:', data);
      return data;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.getByMunicipality - Error:', error);
      throw error;
    }
  }
} 