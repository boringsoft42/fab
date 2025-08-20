import { useState, useCallback } from 'react';
import { apiCall } from '@/lib/api';

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number;
  videoProgress?: number;
  lastWatchedAt?: string;
}

export interface ProgressUpdate {
  lessonId: string;
  isCompleted?: boolean;
  timeSpent?: number;
  videoProgress?: number;
}

export const useLessonProgress = (enrollmentId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLessonProgress = useCallback(async (progressData: ProgressUpdate) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall('/lesson-progress', {
        method: 'POST',
        body: JSON.stringify({
          enrollmentId,
          ...progressData
        })
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar progreso';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  const markLessonAsCompleted = useCallback(async (lessonId: string, timeSpent: number = 0) => {
    return updateLessonProgress({
      lessonId,
      isCompleted: true,
      timeSpent
    });
  }, [updateLessonProgress]);

  const updateVideoProgress = useCallback(async (lessonId: string, videoProgress: number, timeSpent: number) => {
    return updateLessonProgress({
      lessonId,
      videoProgress,
      timeSpent
    });
  }, [updateLessonProgress]);

  const getLessonProgress = useCallback(async (lessonId: string): Promise<LessonProgress | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall(`/lesson-progress?enrollmentId=${enrollmentId}&lessonId=${lessonId}`);
      return response.progress || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener progreso';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  const getEnrollmentProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall(`/lesson-progress?enrollmentId=${enrollmentId}`);
      return response.progress || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener progreso de inscripción';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  return {
    loading,
    error,
    updateLessonProgress,
    markLessonAsCompleted,
    updateVideoProgress,
    getLessonProgress,
    getEnrollmentProgress
  };
};
