import { apiCall } from '@/lib/api';
import { LessonProgress } from '@/types/courses';

export class LessonProgressService {
  static async getAll(): Promise<LessonProgress[]> {
    return await apiCall('/lesson-progress');
  }

  static async getById(id: string): Promise<LessonProgress> {
    return await apiCall(`/lesson-progress/${id}`);
  }

  static async create(data: Partial<LessonProgress>): Promise<LessonProgress> {
    return await apiCall('/lesson-progress', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<LessonProgress>): Promise<LessonProgress> {
    return await apiCall(`/lesson-progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/lesson-progress/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para lesson progress
  static async getByEnrollment(enrollmentId: string): Promise<LessonProgress[]> {
    return await apiCall(`/lesson-progress?enrollmentId=${enrollmentId}`);
  }

  static async getByLesson(lessonId: string): Promise<LessonProgress[]> {
    return await apiCall(`/lesson-progress?lessonId=${lessonId}`);
  }

  static async getMyProgress(): Promise<LessonProgress[]> {
    return await apiCall('/lesson-progress/my-progress');
  }

  static async getByCourse(courseId: string): Promise<LessonProgress[]> {
    return await apiCall(`/lesson-progress?courseId=${courseId}`);
  }

  static async markAsCompleted(lessonId: string, enrollmentId: string): Promise<LessonProgress> {
    return await apiCall(`/lesson-progress/complete`, {
      method: 'POST',
      body: JSON.stringify({ lessonId, enrollmentId })
    });
  }

  static async updateTimeSpent(lessonId: string, enrollmentId: string, timeSpent: number): Promise<LessonProgress> {
    return await apiCall(`/lesson-progress/time-spent`, {
      method: 'PUT',
      body: JSON.stringify({ lessonId, enrollmentId, timeSpent })
    });
  }

  static async getProgressStats(enrollmentId: string): Promise<{
    totalLessons: number;
    completedLessons: number;
    totalTimeSpent: number;
    completionPercentage: number;
  }> {
    return await apiCall(`/lesson-progress/stats/${enrollmentId}`);
  }

  static async bulkUpdateProgress(progressUpdates: Array<{
    lessonId: string;
    enrollmentId: string;
    isCompleted?: boolean;
    timeSpent?: number;
  }>): Promise<LessonProgress[]> {
    return await apiCall('/lesson-progress/bulk', {
      method: 'PUT',
      body: JSON.stringify({ progressUpdates })
    });
  }
} 