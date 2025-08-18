import { apiCall } from '@/lib/api';
import { CourseModule } from '@/types/api';

export class CourseModuleService {
  static async getAll(): Promise<CourseModule[]> {
    return await apiCall('/course-modules');
  }

  static async getById(id: string): Promise<CourseModule> {
    return await apiCall(`/course-modules/${id}`);
  }

  static async create(data: Partial<CourseModule>): Promise<CourseModule> {
    return await apiCall('/course-modules', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<CourseModule>): Promise<CourseModule> {
    return await apiCall(`/course-modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/course-modules/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para módulos
  static async getModulesByCourse(courseId: string): Promise<CourseModule[]> {
    return await apiCall(`/course-modules?courseId=${courseId}`);
  }
} 