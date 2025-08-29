import { apiCall } from '@/lib/api';

export interface Institution {
  id: string;
  userId: string;
  name: string;
  institutionType: string;
  customType?: string;
  serviceArea?: string;
  specialization?: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  municipality: string;
  department: string;
  region: string;
  country?: string;
  website?: string;
  logo?: string;
  profileCompletion: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export class InstitutionService {
  static async getAll(filters?: {
    municipality?: string;
    department?: string;
    serviceArea?: string;
    specialization?: string;
    search?: string;
  }): Promise<Institution[]> {
    console.log("🏛️ InstitutionService.getAll() - Calling apiCall('/institution') with filters:", filters);
    try {
      const params = new URLSearchParams();
      if (filters?.municipality) params.append('municipality', filters.municipality);
      if (filters?.department) params.append('department', filters.department);
      if (filters?.serviceArea) params.append('serviceArea', filters.serviceArea);
      if (filters?.specialization) params.append('specialization', filters.specialization);
      if (filters?.search) params.append('search', filters.search);

      const url = `/institution${params.toString() ? `?${params.toString()}` : ''}`;
      const result = await apiCall(url);
      console.log("✅ InstitutionService.getAll() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.getAll() - Error:", error);
      throw error;
    }
  }

  static async getPublic(filters?: {
    municipality?: string;
    department?: string;
    serviceArea?: string;
    specialization?: string;
    search?: string;
  }): Promise<Institution[]> {
    console.log("🏛️ InstitutionService.getPublic() - Calling apiCall('/institution/public') with filters:", filters);
    try {
      const params = new URLSearchParams();
      if (filters?.municipality) params.append('municipality', filters.municipality);
      if (filters?.department) params.append('department', filters.department);
      if (filters?.serviceArea) params.append('serviceArea', filters.serviceArea);
      if (filters?.specialization) params.append('specialization', filters.specialization);
      if (filters?.search) params.append('search', filters.search);

      const url = `/institution/public${params.toString() ? `?${params.toString()}` : ''}`;
      const result = await apiCall(url);
      console.log("✅ InstitutionService.getPublic() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.getPublic() - Error:", error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Institution> {
    console.log("🏛️ InstitutionService.getById() - Calling apiCall(`/institution/${id}`)");
    try {
      const result = await apiCall(`/institution/${id}`);
      console.log("✅ InstitutionService.getById() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.getById() - Error:", error);
      throw error;
    }
  }

  static async create(data: Partial<Institution>): Promise<Institution> {
    console.log("🏛️ InstitutionService.create() - Calling apiCall('/institution') with data:", data);
    try {
      const result = await apiCall('/institution', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log("✅ InstitutionService.create() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.create() - Error:", error);
      throw error;
    }
  }

  static async update(id: string, data: Partial<Institution>): Promise<Institution> {
    console.log("🏛️ InstitutionService.update() - Calling apiCall(`/institution/${id}`) with data:", data);
    try {
      const result = await apiCall(`/institution/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log("✅ InstitutionService.update() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.update() - Error:", error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    console.log("🏛️ InstitutionService.delete() - Calling apiCall(`/institution/${id}`)");
    try {
      await apiCall(`/institution/${id}`, { method: 'DELETE' });
      console.log("✅ InstitutionService.delete() - Success");
    } catch (error) {
      console.error("❌ InstitutionService.delete() - Error:", error);
      throw error;
    }
  }

  static async getByMunicipality(municipality: string): Promise<Institution[]> {
    console.log("🏛️ InstitutionService.getByMunicipality() - Calling apiCall(`/institution/public?municipality=${municipality}`)");
    try {
      const result = await apiCall(`/institution/public?municipality=${encodeURIComponent(municipality)}`);
      console.log("✅ InstitutionService.getByMunicipality() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.getByMunicipality() - Error:", error);
      throw error;
    }
  }

  static async getByDepartment(department: string): Promise<Institution[]> {
    console.log("🏛️ InstitutionService.getByDepartment() - Calling apiCall(`/institution/public?department=${department}`)");
    try {
      const result = await apiCall(`/institution/public?department=${encodeURIComponent(department)}`);
      console.log("✅ InstitutionService.getByDepartment() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.getByDepartment() - Error:", error);
      throw error;
    }
  }

  static async getByServiceArea(serviceArea: string): Promise<Institution[]> {
    console.log("🏛️ InstitutionService.getByServiceArea() - Calling apiCall(`/institution/public?serviceArea=${serviceArea}`)");
    try {
      const result = await apiCall(`/institution/public?serviceArea=${encodeURIComponent(serviceArea)}`);
      console.log("✅ InstitutionService.getByServiceArea() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.getByServiceArea() - Error:", error);
      throw error;
    }
  }

  static async search(query: string): Promise<Institution[]> {
    console.log("🏛️ InstitutionService.search() - Calling apiCall(`/institution/public?search=${query}`)");
    try {
      const result = await apiCall(`/institution/public?search=${encodeURIComponent(query)}`);
      console.log("✅ InstitutionService.search() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ InstitutionService.search() - Error:", error);
      throw error;
    }
  }

  // Helper method to get all unique municipalities from institutions
  static async getMunicipalities(): Promise<string[]> {
    try {
      const institutions = await this.getPublic();
      const municipalities = [...new Set(institutions.map(inst => inst.municipality).filter(Boolean))];
      return municipalities.sort();
    } catch (error) {
      console.error("❌ InstitutionService.getMunicipalities() - Error:", error);
      return [];
    }
  }

  // Helper method to get all unique departments from institutions
  static async getDepartments(): Promise<string[]> {
    try {
      const institutions = await this.getPublic();
      const departments = [...new Set(institutions.map(inst => inst.department).filter(Boolean))];
      return departments.sort();
    } catch (error) {
      console.error("❌ InstitutionService.getDepartments() - Error:", error);
      return [];
    }
  }

  // Helper method to get all unique service areas from institutions
  static async getServiceAreas(): Promise<string[]> {
    try {
      const institutions = await this.getPublic();
      const serviceAreas = [...new Set(institutions.map(inst => inst.serviceArea).filter(Boolean))];
      return serviceAreas.sort();
    } catch (error) {
      console.error("❌ InstitutionService.getServiceAreas() - Error:", error);
      return [];
    }
  }

  // Helper method to get all unique specializations from institutions
  static async getSpecializations(): Promise<string[]> {
    try {
      const institutions = await this.getPublic();
      const specializations = [...new Set(institutions.map(inst => inst.specialization).filter(Boolean))];
      return specializations.sort();
    } catch (error) {
      console.error("❌ InstitutionService.getSpecializations() - Error:", error);
      return [];
    }
  }
}