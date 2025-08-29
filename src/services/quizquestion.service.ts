import { apiCall } from '@/lib/api';
import { QuizQuestion } from '@/types/courses';

export class QuizQuestionService {
  static async getAll(): Promise<QuizQuestion[]> {
    return await apiCall('/quiz-questions');
  }

  static async getById(id: string): Promise<QuizQuestion> {
    return await apiCall(`/quiz-questions/${id}`);
  }

  static async create(data: Partial<QuizQuestion>): Promise<QuizQuestion> {
    return await apiCall('/quiz-questions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<QuizQuestion>): Promise<QuizQuestion> {
    return await apiCall(`/quiz-questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/quiz-questions/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para quiz questions
  static async getByQuiz(quizId: string): Promise<QuizQuestion[]> {
    return await apiCall(`/quiz-questions?quizId=${quizId}`);
  }

  static async getByType(type: string): Promise<QuizQuestion[]> {
    return await apiCall(`/quiz-questions?type=${encodeURIComponent(type)}`);
  }

  static async getByOrder(quizId: string): Promise<QuizQuestion[]> {
    return await apiCall(`/quiz-questions?quizId=${quizId}&order=asc`);
  }

  static async getRandomQuestions(quizId: string, count: number): Promise<QuizQuestion[]> {
    return await apiCall(`/quiz-questions/random?quizId=${quizId}&count=${count}`);
  }

  static async duplicateQuestion(id: string): Promise<QuizQuestion> {
    return await apiCall(`/quiz-questions/${id}/duplicate`, { method: 'POST' });
  }

  static async reorderQuestions(quizId: string, questionIds: string[]): Promise<QuizQuestion[]> {
    return await apiCall(`/quiz-questions/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ quizId, questionIds })
    });
  }

  static async bulkCreateQuestions(quizId: string, questions: Partial<QuizQuestion>[]): Promise<QuizQuestion[]> {
    return await apiCall('/quiz-questions/bulk', {
      method: 'POST',
      body: JSON.stringify({ quizId, questions })
    });
  }

  static async bulkUpdateQuestions(questions: { id: string; data: Partial<QuizQuestion> }[]): Promise<QuizQuestion[]> {
    return await apiCall('/quiz-questions/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ questions })
    });
  }

  static async bulkDeleteQuestions(questionIds: string[]): Promise<void> {
    return await apiCall('/quiz-questions/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ questionIds })
    });
  }

  static async getQuestionStats(id: string): Promise<{
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    averageTimeSpent: number;
    difficulty: 'easy' | 'medium' | 'hard';
    successRate: number;
  }> {
    return await apiCall(`/quiz-questions/${id}/stats`);
  }

  static async validateQuestion(data: Partial<QuizQuestion>): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return await apiCall('/quiz-questions/validate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async importQuestions(quizId: string, questions: any[], format: 'json' | 'csv' = 'json'): Promise<QuizQuestion[]> {
    return await apiCall('/quiz-questions/import', {
      method: 'POST',
      body: JSON.stringify({ quizId, questions, format })
    });
  }

  static async exportQuestions(quizId: string, format: 'json' | 'csv' = 'json'): Promise<Blob> {
    return await apiCall(`/quiz-questions/export?quizId=${quizId}&format=${format}`, {
      responseType: 'blob'
    });
  }

  static async getQuestionTemplates(): Promise<{
    id: string;
    name: string;
    type: string;
    template: Partial<QuizQuestion>;
  }[]> {
    return await apiCall('/quiz-questions/templates');
  }

  static async createFromTemplate(templateId: string, quizId: string, customizations?: Partial<QuizQuestion>): Promise<QuizQuestion> {
    return await apiCall('/quiz-questions/from-template', {
      method: 'POST',
      body: JSON.stringify({ templateId, quizId, customizations })
    });
  }

  static async toggleQuestionActive(id: string): Promise<QuizQuestion> {
    return await apiCall(`/quiz-questions/${id}/toggle`, { method: 'POST' });
  }

  static async getQuestionPreview(id: string): Promise<{
    question: QuizQuestion;
    preview: string;
    estimatedTime: number;
  }> {
    return await apiCall(`/quiz-questions/${id}/preview`);
  }
} 