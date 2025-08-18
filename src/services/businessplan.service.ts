import { apiCall, API_BASE } from '@/lib/api';
import { BusinessPlan } from '@/types/api';

export class BusinessPlanService {
  static async getAll(): Promise<BusinessPlan[]> {
    return await apiCall('/businessplan');
  }

  static async getById(id: string): Promise<BusinessPlan> {
    return await apiCall(`/businessplan/${id}`);
  }

  static async create(data: Partial<BusinessPlan>): Promise<BusinessPlan> {
    return await apiCall('/businessplan', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<BusinessPlan>): Promise<BusinessPlan> {
    return await apiCall(`/businessplan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/businessplan/${id}`, { method: 'DELETE' });
  }
} 