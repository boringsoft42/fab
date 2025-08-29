import { apiCall } from '@/lib/api';
import { Quiz } from '@/types/courses';

export class QuizService {
  static async getAll(): Promise<Quiz[]> {
    return await apiCall('/quizzes');
  }

  static async getById(id: string): Promise<Quiz> {
    return await apiCall(`/quizzes/${id}`);
  }

  static async create(data: Partial<Quiz>): Promise<Quiz> {
    return await apiCall('/quizzes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<Quiz>): Promise<Quiz> {
    return await apiCall(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/quizzes/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para quizzes
  static async getByCourse(courseId: string): Promise<Quiz[]> {
    return await apiCall(`/quizzes?courseId=${courseId}`);
  }

  static async getByLesson(lessonId: string): Promise<Quiz[]> {
    return await apiCall(`/quizzes?lessonId=${lessonId}`);
  }

  static async getActiveQuizzes(): Promise<Quiz[]> {
    return await apiCall('/quizzes?isActive=true');
  }

  static async getQuizzesByCategory(category: string): Promise<Quiz[]> {
    return await apiCall(`/quizzes?category=${encodeURIComponent(category)}`);
  }

  static async duplicateQuiz(id: string): Promise<Quiz> {
    return await apiCall(`/quizzes/${id}/duplicate`, { method: 'POST' });
  }

  static async toggleQuizStatus(id: string): Promise<Quiz> {
    return await apiCall(`/quizzes/${id}/toggle`, { method: 'POST' });
  }

  static async getQuizStats(id: string): Promise<{
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    completionRate: number;
    timeSpent: number;
  }> {
    return await apiCall(`/quizzes/${id}/stats`);
  }

  static async exportQuizResults(id: string, format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    return await apiCall(`/quizzes/${id}/export?format=${format}`, {
      responseType: 'blob'
    });
  }

  static async bulkUpdateQuizzes(quizIds: string[], updates: Partial<Quiz>): Promise<Quiz[]> {
    return await apiCall('/quizzes/bulk', {
      method: 'PUT',
      body: JSON.stringify({ quizIds, updates })
    });
  }

  static async reorderQuestions(quizId: string, questionIds: string[]): Promise<Quiz> {
    return await apiCall(`/quizzes/${quizId}/reorder-questions`, {
      method: 'PUT',
      body: JSON.stringify({ questionIds })
    });
  }
} 