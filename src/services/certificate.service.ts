import { apiCall } from '@/lib/api';
import { Certificate } from '@/types/api';

export class CertificateService {
  static async getAll(): Promise<Certificate[]> {
    return await apiCall('/certificates');
  }

  static async getById(id: string): Promise<Certificate> {
    return await apiCall(`/certificates/${id}`);
  }

  static async create(data: Partial<Certificate>): Promise<Certificate> {
    return await apiCall('/certificates', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<Certificate>): Promise<Certificate> {
    return await apiCall(`/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/certificates/${id}`, { method: 'DELETE' });
  }
} 