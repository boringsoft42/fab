import { apiCall, BACKEND_URL } from '@/lib/api';
import { Entrepreneurship } from '@/types/profile';

export class EntrepreneurshipService {
  // Get all entrepreneurships
  static async getAllEntrepreneurships(filters?: any) {
    try {
      console.log('🔍 EntrepreneurshipService.getAllEntrepreneurships - Fetching entrepreneurships with filters:', filters);
      
      const queryParams = new URLSearchParams();
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.municipality) queryParams.append('municipality', filters.municipality);
      if (filters?.ownerId) queryParams.append('ownerId', filters.ownerId);
      if (filters?.isPublic !== undefined) queryParams.append('isPublic', filters.isPublic.toString());
      
      const url = `/entrepreneurship${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const data = await apiCall(url);
      console.log('✅ EntrepreneurshipService.getAllEntrepreneurships - Success:', data);
      return data;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.getAllEntrepreneurships - Error:', error);
      throw error;
    }
  }

  // Get public entrepreneurships (same as getAllEntrepreneurships with isPublic=true)
  static async getPublicEntrepreneurships() {
    try {
      console.log('🔍 EntrepreneurshipService.getPublicEntrepreneurships - Fetching public entrepreneurships');
      
      const data = await apiCall('/entrepreneurship?isPublic=true');
      console.log('✅ EntrepreneurshipService.getPublicEntrepreneurships - Success:', data);
      return data;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.getPublicEntrepreneurships - Error:', error);
      throw error;
    }
  }

  // Get current user's entrepreneurships
  static async getMyEntrepreneurships() {
    try {
      console.log('🔍 EntrepreneurshipService.getMyEntrepreneurships - Fetching user entrepreneurships');
      
      // Get current user info from auth service first, then filter by ownerId
      const { user } = await import('./auth.service');
      const currentUser = user; // This should be populated by auth context
      
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      const data = await apiCall(`/entrepreneurship?ownerId=${currentUser.id}`);
      console.log('✅ EntrepreneurshipService.getMyEntrepreneurships - Success:', data);
      return data;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.getMyEntrepreneurships - Error:', error);
      throw error;
    }
  }

  // Get specific entrepreneurship by ID
  static async getEntrepreneurship(id: string) {
    try {
      console.log('🔍 EntrepreneurshipService.getEntrepreneurship - Fetching entrepreneurship:', id);
      
      const data = await apiCall(`/entrepreneurship/${id}`);
      console.log('✅ EntrepreneurshipService.getEntrepreneurship - Success:', data);
      return data;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.getEntrepreneurship - Error:', error);
      throw error;
    }
  }

  // Create entrepreneurship
  static async createEntrepreneurship(data: any) {
    try {
      console.log('🔍 EntrepreneurshipService.createEntrepreneurship - Creating entrepreneurship:', data);
      
      const result = await apiCall('/entrepreneurship', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log('✅ EntrepreneurshipService.createEntrepreneurship - Success:', result);
      return result;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.createEntrepreneurship - Error:', error);
      throw error;
    }
  }

  // Update entrepreneurship
  static async updateEntrepreneurship(id: string, data: any) {
    try {
      console.log('🔍 EntrepreneurshipService.updateEntrepreneurship - Updating entrepreneurship:', id, data);
      
      const result = await apiCall(`/entrepreneurship/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('✅ EntrepreneurshipService.updateEntrepreneurship - Success:', result);
      return result;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.updateEntrepreneurship - Error:', error);
      throw error;
    }
  }

  // Delete entrepreneurship
  static async deleteEntrepreneurship(id: string) {
    try {
      console.log('🔍 EntrepreneurshipService.deleteEntrepreneurship - Deleting entrepreneurship:', id);
      
      const result = await apiCall(`/entrepreneurship/${id}`, {
        method: 'DELETE'
      });
      console.log('✅ EntrepreneurshipService.deleteEntrepreneurship - Success:', result);
      return result;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.deleteEntrepreneurship - Error:', error);
      throw error;
    }
  }

  // Increment view count
  static async incrementViews(id: string) {
    try {
      console.log('🔍 EntrepreneurshipService.incrementViews - Incrementing views for:', id);
      
      const result = await apiCall(`/entrepreneurship/${id}/views`, { method: 'POST' });
      console.log('✅ EntrepreneurshipService.incrementViews - Success:', result);
      return result;
    } catch (error) {
      console.error('❌ EntrepreneurshipService.incrementViews - Error:', error);
      throw error;
    }
  }

  // Get entrepreneurships by owner
  static async getByOwner(ownerId: string) {
    return await this.getAllEntrepreneurships({ ownerId });
  }

  // Get entrepreneurships by category
  static async getByCategory(category: string) {
    return await this.getAllEntrepreneurships({ category });
  }

  // Get entrepreneurships by municipality
  static async getByMunicipality(municipality: string) {
    return await this.getAllEntrepreneurships({ municipality });
  }
} 