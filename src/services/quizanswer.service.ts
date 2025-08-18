import { apiCall } from '@/lib/api';
import { QuizAnswer } from '@/types/courses';

// Extend the QuizAnswer interface to include id and other fields from Prisma
interface QuizAnswerWithId extends QuizAnswer {
  id: string;
  attemptId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class QuizAnswerService {
  static async getAll(): Promise<QuizAnswerWithId[]> {
    return await apiCall('/quiz-answers');
  }

  static async getById(id: string): Promise<QuizAnswerWithId> {
    return await apiCall(`/quiz-answers/${id}`);
  }

  static async create(data: Partial<QuizAnswerWithId>): Promise<QuizAnswerWithId> {
    return await apiCall('/quiz-answers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<QuizAnswerWithId>): Promise<QuizAnswerWithId> {
    return await apiCall(`/quiz-answers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/quiz-answers/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para quiz answers
  static async getByAttempt(attemptId: string): Promise<QuizAnswerWithId[]> {
    return await apiCall(`/quiz-answers?attemptId=${attemptId}`);
  }

  static async getByQuestion(questionId: string): Promise<QuizAnswerWithId[]> {
    return await apiCall(`/quiz-answers?questionId=${questionId}`);
  }

  static async getByQuiz(quizId: string): Promise<QuizAnswerWithId[]> {
    return await apiCall(`/quiz-answers?quizId=${quizId}`);
  }

  static async getMyAnswers(): Promise<QuizAnswerWithId[]> {
    return await apiCall('/quiz-answers/my-answers');
  }

  static async getCorrectAnswers(questionId: string): Promise<QuizAnswerWithId[]> {
    return await apiCall(`/quiz-answers?questionId=${questionId}&isCorrect=true`);
  }

  static async getAnswersByUser(userId: string): Promise<QuizAnswerWithId[]> {
    return await apiCall(`/quiz-answers?userId=${userId}`);
  }

  static async bulkCreateAnswers(answers: Partial<QuizAnswerWithId>[]): Promise<QuizAnswerWithId[]> {
    return await apiCall('/quiz-answers/bulk', {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }

  static async getAnswerStats(questionId: string): Promise<{
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    averageTimeSpent: number;
    mostCommonAnswer: string;
  }> {
    return await apiCall(`/quiz-answers/stats/${questionId}`);
  }

  static async getAttemptAnswers(attemptId: string): Promise<{
    answers: QuizAnswerWithId[];
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
  }> {
    return await apiCall(`/quiz-answers/attempt/${attemptId}`);
  }

  static async updateAnswerText(id: string, answer: string): Promise<QuizAnswerWithId> {
    return await apiCall(`/quiz-answers/${id}/text`, {
      method: 'PUT',
      body: JSON.stringify({ answer })
    });
  }

  static async markAsCorrect(id: string): Promise<QuizAnswerWithId> {
    return await apiCall(`/quiz-answers/${id}/correct`, { method: 'POST' });
  }

  static async markAsIncorrect(id: string): Promise<QuizAnswerWithId> {
    return await apiCall(`/quiz-answers/${id}/incorrect`, { method: 'POST' });
  }
} 