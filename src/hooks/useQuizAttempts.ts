import { useState, useCallback } from 'react';
import { apiCall } from '@/lib/api';

interface QuizAnswer {
  questionId: string;
  answer: string;
  timeSpent: number;
}

interface QuizAttemptResult {
  id: string;
  quizId: string;
  enrollmentId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  completedAt: string;
  answers: any[];
}

export const useQuizAttempts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeQuiz = useCallback(async (
    quizId: string, 
    enrollmentId: string, 
    answers: QuizAnswer[]
  ): Promise<QuizAttemptResult | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useQuizAttempts: Completing quiz:', {
        quizId,
        enrollmentId,
        answersCount: answers.length
      });
      
      const response = await apiCall('/quizattempt/complete', {
        method: 'POST',
        body: JSON.stringify({
          quizId,
          enrollmentId,
          answers
        })
      });
      
      console.log('🔍 useQuizAttempts: Quiz completion response:', response);
      
      return {
        id: response.attempt?.id || 'temp-id',
        quizId,
        enrollmentId,
        score: response.score || 0,
        totalQuestions: response.totalQuestions || answers.length,
        passed: response.passed || false,
        completedAt: response.attempt?.completedAt || new Date().toISOString(),
        answers: response.answers || []
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar el quiz';
      setError(errorMessage);
      console.error('Error completing quiz:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuizAttempts = useCallback(async (quizId: string): Promise<any[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(`/quizattempt/quiz/${quizId}`);
      return response.attempts || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar intentos del quiz';
      setError(errorMessage);
      console.error('Error loading quiz attempts:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserQuizAttempts = useCallback(async (enrollmentId: string): Promise<any[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(`/quizattempt/enrollment/${enrollmentId}`);
      return response.attempts || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar intentos del usuario';
      setError(errorMessage);
      console.error('Error loading user quiz attempts:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    completeQuiz,
    getQuizAttempts,
    getUserQuizAttempts
  };
};
