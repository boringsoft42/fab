import { apiCall, getToken } from '@/lib/api';

export interface Company {
  id: string;
  name: string;
  description: string | null;
  businessSector: string | null;
  companySize: string | null;
  foundedYear: number | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  municipality: {
    id: string;
    name: string;
    department: string;
  };
  creator: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  businessSector: string;
  companySize?: string;
  foundedYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  municipalityId: string;
  username?: string;
  password?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  businessSector?: string;
  companySize?: string;
  foundedYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  municipalityId?: string;
  isActive?: boolean;
}

export class CompanyApiService {
  /**
   * Get all companies
   */
  static async getAll(): Promise<Company[]> {
    console.log("📞 CompanyApiService.getAll() - Calling apiCall('/company')");

    // Debug: Check token status
    const token = getToken();
    console.log("🔐 CompanyApiService.getAll() - Token exists:", !!token);
    console.log("🔐 CompanyApiService.getAll() - Token value:", token ? `${token.substring(0, 20)}...` : 'null');

    try {
      const result = await apiCall('/company');
      console.log("✅ CompanyApiService.getAll() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ CompanyApiService.getAll() - Error:", error);
      throw error;
    }
  }

  /**
   * Get company by ID
   */
  static async getById(id: string): Promise<Company> {
    console.log("📞 CompanyApiService.getById() - Calling apiCall(`/company/${id}`)");
    try {
      const result = await apiCall(`/company/${id}`);
      console.log("✅ CompanyApiService.getById() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ CompanyApiService.getById() - Error:", error);
      throw error;
    }
  }

  /**
 * Create new company
 */
  static async create(data: CreateCompanyRequest): Promise<Company> {
    console.log("📞 CompanyApiService.create() - Calling apiCall('/company') with data:", data);

    // Debug: Check token status
    const token = getToken();
    console.log("🔐 CompanyApiService.create() - Token exists:", !!token);
    console.log("🔐 CompanyApiService.create() - Token value:", token ? `${token.substring(0, 20)}...` : 'null');
    console.log("🔐 CompanyApiService.create() - Full token:", token);
    console.log("🔐 CompanyApiService.create() - Authorization header that should be sent:", `Bearer ${token}`);

    // Debug: Check localStorage directly
    console.log("🔐 CompanyApiService.create() - localStorage token:", localStorage.getItem('token'));
    console.log("🔐 CompanyApiService.create() - localStorage refreshToken:", localStorage.getItem('refreshToken'));
    console.log("🔐 CompanyApiService.create() - All localStorage keys:", Object.keys(localStorage));

    try {
      console.log("🔐 CompanyApiService.create() - About to call apiCall");
      const result = await apiCall('/company', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log("✅ CompanyApiService.create() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ CompanyApiService.create() - Error:", error);
      throw error;
    }
  }

  /**
   * Update company
   */
  static async update(id: string, data: UpdateCompanyRequest): Promise<Company> {
    console.log("📞 CompanyApiService.update() - Calling apiCall(`/company/${id}`) with data:", data);
    try {
      const result = await apiCall(`/company/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log("✅ CompanyApiService.update() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ CompanyApiService.update() - Error:", error);
      throw error;
    }
  }

  /**
   * Delete company
   */
  static async delete(id: string): Promise<void> {
    console.log("📞 CompanyApiService.delete() - Calling apiCall(`/company/${id}`)");
    try {
      const result = await apiCall(`/company/${id}`, {
        method: 'DELETE'
      });
      console.log("✅ CompanyApiService.delete() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ CompanyApiService.delete() - Error:", error);
      throw error;
    }
  }

  /**
   * Get company statistics
   */
  static async getStats(): Promise<{
    totalCompanies: number;
    activeCompanies: number;
    pendingCompanies: number;
    inactiveCompanies: number;
    totalEmployees: number;
    totalRevenue: number;
  }> {
    console.log("📊 CompanyApiService.getStats() - Calling apiCall('/company/stats')");
    try {
      const result = await apiCall('/company/stats');
      console.log("✅ CompanyApiService.getStats() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ CompanyApiService.getStats() - Error:", error);
      throw error;
    }
  }

  /**
   * Search companies by municipality
   */
  static async searchByMunicipality(municipalityId: string): Promise<Company[]> {
    console.log("🔍 CompanyApiService.searchByMunicipality() - Calling apiCall(`/company/search?municipalityId=${municipalityId}`)");
    try {
      const result = await apiCall(`/company/search?municipalityId=${municipalityId}`);
      console.log("✅ CompanyApiService.searchByMunicipality() - Success:", result);
      return result.companies || result;
    } catch (error) {
      console.error("❌ CompanyApiService.searchByMunicipality() - Error:", error);
      throw error;
    }
  }
} 