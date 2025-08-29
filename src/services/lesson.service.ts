import { apiCall } from '@/lib/api';
import { Lesson } from '@/types/courses';

export class LessonService {
  static async getAll(): Promise<Lesson[]> {
    return await apiCall('/lessons');
  }

  static async getById(id: string): Promise<Lesson> {
    return await apiCall(`/lessons/${id}`);
  }

  static async create(data: Partial<Lesson>): Promise<Lesson> {
    return await apiCall('/lessons', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<Lesson>): Promise<Lesson> {
    return await apiCall(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/lessons/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para lessons
  static async getByModule(moduleId: string): Promise<Lesson[]> {
    return await apiCall(`/lessons?moduleId=${moduleId}`);
  }

  static async getByCourse(courseId: string): Promise<Lesson[]> {
    return await apiCall(`/lessons?courseId=${courseId}`);
  }

  static async getByType(type: string): Promise<Lesson[]> {
    return await apiCall(`/lessons?type=${type}`);
  }

  static async getPreviewLessons(): Promise<Lesson[]> {
    return await apiCall('/lessons?isPreview=true');
  }

  static async reorderLessons(moduleId: string, lessonIds: string[]): Promise<Lesson[]> {
    return await apiCall(`/lessons/${moduleId}/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ lessonIds })
    });
  }

  static async duplicateLesson(id: string): Promise<Lesson> {
    return await apiCall(`/lessons/${id}/duplicate`, { method: 'POST' });
  }

  static async togglePreview(id: string): Promise<Lesson> {
    return await apiCall(`/lessons/${id}/preview`, { method: 'POST' });
  }

  static async getLessonProgress(lessonId: string): Promise<{
    completed: boolean;
    timeSpent: number;
    lastAccessedAt: string;
  }> {
    return await apiCall(`/lessons/${lessonId}/progress`);
  }
} 