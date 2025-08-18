import { apiCall } from '@/lib/api';
import { QuizAttempt } from '@/types/courses';

export class QuizAttemptService {
  static async getAll(): Promise<QuizAttempt[]> {
    return await apiCall('/quiz-attempts');
  }

  static async getById(id: string): Promise<QuizAttempt> {
    return await apiCall(`/quiz-attempts/${id}`);
  }

  static async create(data: Partial<QuizAttempt>): Promise<QuizAttempt> {
    return await apiCall('/quiz-attempts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<QuizAttempt>): Promise<QuizAttempt> {
    return await apiCall(`/quiz-attempts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/quiz-attempts/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para quiz attempts
  static async getByQuiz(quizId: string): Promise<QuizAttempt[]> {
    return await apiCall(`/quiz-attempts?quizId=${quizId}`);
  }

  static async getByStudent(studentId: string): Promise<QuizAttempt[]> {
    return await apiCall(`/quiz-attempts?studentId=${studentId}`);
  }

  static async getByEnrollment(enrollmentId: string): Promise<QuizAttempt[]> {
    return await apiCall(`/quiz-attempts?enrollmentId=${enrollmentId}`);
  }

  static async getMyAttempts(): Promise<QuizAttempt[]> {
    return await apiCall('/quiz-attempts/my-attempts');
  }

  static async getPassedAttempts(quizId: string): Promise<QuizAttempt[]> {
    return await apiCall(`/quiz-attempts?quizId=${quizId}&passed=true`);
  }

  static async getFailedAttempts(quizId: string): Promise<QuizAttempt[]> {
    return await apiCall(`/quiz-attempts?quizId=${quizId}&passed=false`);
  }

  static async getActiveAttempts(): Promise<QuizAttempt[]> {
    return await apiCall('/quiz-attempts?completedAt=null');
  }

  static async getCompletedAttempts(): Promise<QuizAttempt[]> {
    return await apiCall('/quiz-attempts?completedAt=not-null');
  }

  static async startAttempt(quizId: string, enrollmentId?: string): Promise<QuizAttempt> {
    return await apiCall('/quiz-attempts/start', {
      method: 'POST',
      body: JSON.stringify({ quizId, enrollmentId })
    });
  }

  static async completeAttempt(id: string, answers: any[], timeSpent: number): Promise<QuizAttempt> {
    return await apiCall(`/quiz-attempts/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent })
    });
  }

  static async submitAttempt(id: string, answers: any[]): Promise<QuizAttempt> {
    return await apiCall(`/quiz-attempts/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }

  static async pauseAttempt(id: string): Promise<QuizAttempt> {
    return await apiCall(`/quiz-attempts/${id}/pause`, { method: 'POST' });
  }

  static async resumeAttempt(id: string): Promise<QuizAttempt> {
    return await apiCall(`/quiz-attempts/${id}/resume`, { method: 'POST' });
  }

  static async getAttemptStats(quizId: string): Promise<{
    totalAttempts: number;
    passedAttempts: number;
    failedAttempts: number;
    averageScore: number;
    averageTimeSpent: number;
    bestScore: number;
    passRate: number;
  }> {
    return await apiCall(`/quiz-attempts/stats/${quizId}`);
  }

  static async getStudentAttemptStats(studentId: string): Promise<{
    totalAttempts: number;
    passedAttempts: number;
    failedAttempts: number;
    averageScore: number;
    totalTimeSpent: number;
    quizzesAttempted: number;
    quizzesPassed: number;
  }> {
    return await apiCall(`/quiz-attempts/student-stats/${studentId}`);
  }

  static async getBestAttempt(quizId: string, studentId: string): Promise<QuizAttempt | null> {
    return await apiCall(`/quiz-attempts/best/${quizId}/${studentId}`);
  }

  static async getAttemptHistory(quizId: string, studentId: string): Promise<QuizAttempt[]> {
    return await apiCall(`/quiz-attempts/history/${quizId}/${studentId}`);
  }

  static async resetAttempt(id: string): Promise<QuizAttempt> {
    return await apiCall(`/quiz-attempts/${id}/reset`, { method: 'POST' });
  }

  static async extendTimeLimit(id: string, additionalMinutes: number): Promise<QuizAttempt> {
    return await apiCall(`/quiz-attempts/${id}/extend-time`, {
      method: 'POST',
      body: JSON.stringify({ additionalMinutes })
    });
  }

  static async validateAttempt(id: string): Promise<{
    isValid: boolean;
    reason?: string;
    timeRemaining?: number;
  }> {
    return await apiCall(`/quiz-attempts/${id}/validate`);
  }
} 