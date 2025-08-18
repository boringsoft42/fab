import { apiCall } from '@/lib/api';
import { JobApplication } from '@/types/jobs';

export class JobApplicationService {
  static async getAll(): Promise<JobApplication[]> {
    return await apiCall('/jobapplication');
  }

  static async getById(id: string): Promise<JobApplication> {
    return await apiCall(`/jobapplication/${id}`);
  }

  static async create(data: Partial<JobApplication>): Promise<JobApplication> {
    return await apiCall('/jobapplication', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<JobApplication>): Promise<JobApplication> {
    return await apiCall(`/jobapplication/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/jobapplication/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para job applications
  static async getByApplicant(applicantId: string): Promise<JobApplication[]> {
    return await apiCall(`/jobapplication?applicantId=${applicantId}`);
  }

  static async getByJob(jobId: string): Promise<JobApplication[]> {
    return await apiCall(`/jobapplication?jobId=${jobId}`);
  }

  static async getByStatus(status: string): Promise<JobApplication[]> {
    return await apiCall(`/jobapplication?status=${status}`);
  }

  static async updateStatus(id: string, status: string, notes?: string, rating?: number): Promise<JobApplication> {
    return await apiCall(`/jobapplication/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes, rating })
    });
  }

  static async getMyApplications(): Promise<JobApplication[]> {
    console.log("🔍 JobApplicationService.getMyApplications - Calling API...");
    const result = await apiCall('/jobapplication');
    console.log("🔍 JobApplicationService.getMyApplications - API Response:", result);
    
    // Handle the correct response structure: {items: [], pagination: {}}
    const applications = result.items || result.applications || [];
    console.log("🔍 JobApplicationService.getMyApplications - Extracted applications:", applications);
    console.log("🔍 JobApplicationService.getMyApplications - Is Array:", Array.isArray(applications));
    
    return applications;
  }

  static async getCompanyApplications(companyId: string): Promise<JobApplication[]> {
    return await apiCall(`/jobapplication/company/${companyId}`);
  }
} 