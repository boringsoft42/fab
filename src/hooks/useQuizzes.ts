import { useState, useCallback } from 'react';
import { apiCall } from '@/lib/api';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MULTIPLE_SELECT' | 'SHORT_ANSWER' | 'FILL_BLANK';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  orderIndex: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore: number;
  questions: QuizQuestion[];
}

interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  answers: any[];
  completedAt: Date;
  createdAt: Date;
}

export const useQuizzes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuizByLessonId = useCallback(async (lessonId: string): Promise<Quiz | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(`/quizzes/lesson/${lessonId}`, {
        method: 'GET'
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el quiz';
      setError(errorMessage);
      console.error('Error loading quiz:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitQuizAttempt = useCallback(async (quizId: string, enrollmentId: string, answers: any[]): Promise<QuizAttempt | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useQuizzes: Submitting quiz attempt:', {
        quizId,
        enrollmentId,
        answers
      });
      
      const response = await apiCall(`/quizattempt/complete`, {
        method: 'POST',
        body: JSON.stringify({
          quizId,
          enrollmentId,
          answers
        })
      });
      
      console.log('🔍 useQuizzes: Quiz attempt response:', response);
      return response.attempt || response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar el quiz';
      setError(errorMessage);
      console.error('Error submitting quiz:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuizAttempts = useCallback(async (quizId: string): Promise<QuizAttempt[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(`/quiz-attempts/quiz/${quizId}`, {
        method: 'GET'
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar intentos del quiz';
      setError(errorMessage);
      console.error('Error loading quiz attempts:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getQuizByLessonId,
    submitQuizAttempt,
    getQuizAttempts
  };
};
