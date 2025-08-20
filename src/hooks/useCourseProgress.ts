import { useState, useCallback } from 'react';
import { apiCall } from '@/lib/api';

interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number;
  videoProgress?: number;
}

interface ModuleProgress {
  moduleId: string;
  moduleTitle: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
}

interface CourseProgress {
  progress: number;
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
}

interface NextLesson {
  id: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
}

interface CompleteLessonResponse {
  message: string;
  lessonProgress: LessonProgress;
  moduleProgress: ModuleProgress;
  courseProgress: CourseProgress;
  nextLesson?: NextLesson;
}

interface EnrollmentProgress {
  enrollment: {
    id: string;
    status: string;
    progress: number;
    currentModuleId?: string;
    currentLessonId?: string;
    timeSpent: number;
  };
  course: {
    id: string;
    title: string;
    totalLessons: number;
    completedLessons: number;
    progress: number;
    isCompleted: boolean;
  };
  modules: Array<{
    id: string;
    title: string;
    totalLessons: number;
    completedLessons: number;
    progress: number;
    isCompleted: boolean;
    lessons: Array<{
      id: string;
      title: string;
      isCompleted: boolean;
      timeSpent: number;
    }>;
  }>;
  nextLesson?: NextLesson;
}

export const useCourseProgress = (enrollmentId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeLesson = useCallback(async (
    lessonId: string,
    timeSpent: number = 0,
    videoProgress?: number
  ): Promise<CompleteLessonResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useCourseProgress: Completing lesson:', {
        enrollmentId,
        lessonId,
        timeSpent,
        videoProgress
      });
      
      const response = await apiCall('/course-progress/complete-lesson', {
        method: 'POST',
        body: JSON.stringify({
          enrollmentId,
          lessonId,
          timeSpent,
          videoProgress
        })
      });
      
      console.log('🔍 useCourseProgress: Lesson completion response:', response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar la lección';
      setError(errorMessage);
      console.error('Error completing lesson:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  const completeModule = useCallback(async (moduleId: string): Promise<any | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useCourseProgress: Completing module:', {
        enrollmentId,
        moduleId
      });
      
      const response = await apiCall('/course-progress/complete-module', {
        method: 'POST',
        body: JSON.stringify({
          enrollmentId,
          moduleId
        })
      });
      
      console.log('🔍 useCourseProgress: Module completion response:', response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar el módulo';
      setError(errorMessage);
      console.error('Error completing module:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  const getEnrollmentProgress = useCallback(async (): Promise<EnrollmentProgress | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useCourseProgress: Getting enrollment progress:', enrollmentId);
      
      const response = await apiCall(`/course-progress/enrollment/${enrollmentId}`);
      
      console.log('🔍 useCourseProgress: Enrollment progress response:', response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el progreso';
      setError(errorMessage);
      console.error('Error getting enrollment progress:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  const updateVideoProgress = useCallback(async (
    lessonId: string,
    videoProgress: number,
    timeSpent: number
  ): Promise<LessonProgress | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useCourseProgress: Updating video progress:', {
        enrollmentId,
        lessonId,
        videoProgress,
        timeSpent
      });
      
      const response = await apiCall('/course-progress/update-video-progress', {
        method: 'POST',
        body: JSON.stringify({
          enrollmentId,
          lessonId,
          videoProgress,
          timeSpent
        })
      });
      
      console.log('🔍 useCourseProgress: Video progress update response:', response);
      return response.lessonProgress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar progreso del video';
      setError(errorMessage);
      console.error('Error updating video progress:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  return {
    loading,
    error,
    completeLesson,
    completeModule,
    getEnrollmentProgress,
    updateVideoProgress
  };
};
