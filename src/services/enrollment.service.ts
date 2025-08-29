import { apiCall } from '@/lib/api';
import { Enrollment } from '@/types/courses';

export class EnrollmentService {
  static async getAll(): Promise<Enrollment[]> {
    return await apiCall('/course-enrollments');
  }

  static async getById(id: string): Promise<Enrollment> {
    return await apiCall(`/course-enrollments/${id}`);
  }

  static async create(data: Partial<Enrollment>): Promise<Enrollment> {
    return await apiCall('/course-enrollments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<Enrollment>): Promise<Enrollment> {
    return await apiCall(`/course-enrollments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/course-enrollments/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para enrollments
  static async enrollInCourse(courseId: string): Promise<Enrollment> {
    return await apiCall('/course-enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId })
    });
  }

  static async getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
    return await apiCall(`/course-enrollments?userId=${userId}`);
  }

  static async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return await apiCall(`/course-enrollments?courseId=${courseId}`);
  }
} 