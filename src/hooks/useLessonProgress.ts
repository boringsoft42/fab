import { useState, useEffect } from 'react';

interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number; // en segundos
  lastAccessedAt: string;
  notes?: string;
  lesson: {
    id: string;
    title: string;
    type: 'VIDEO' | 'TEXT' | 'INTERACTIVE' | 'DOCUMENT';
    duration: number;
    order: number;
  };
}

export const useLessonProgress = () => {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchLessonProgress = async (enrollmentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/lesson-progress?enrollmentId=${enrollmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching lesson progress: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setLessonProgress(data.lessonProgress || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error in fetchLessonProgress:', err);
    } finally {
      setLoading(false);
    }
  };

  const markLessonAsCompleted = async (
    enrollmentId: string,
    lessonId: string,
    timeSpent: number = 0,
    notes?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/lesson-progress', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enrollmentId,
          lessonId,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          timeSpent,
          notes
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error marking lesson as completed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // Add or update lesson progress in the list
      setLessonProgress(prev => {
        const existingIndex = prev.findIndex(p => p.lessonId === lessonId);
        if (existingIndex >= 0) {
          return prev.map((p, index) => 
            index === existingIndex ? data.lessonProgress : p
          );
        } else {
          return [...prev, data.lessonProgress];
        }
      });
      
      return data.lessonProgress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error in markLessonAsCompleted:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLessonProgress = async (
    enrollmentId: string,
    lessonId: string,
    updates: {
      isCompleted?: boolean;
      timeSpent?: number;
      notes?: string;
    }
  ) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/lesson-progress/${enrollmentId}/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating lesson progress: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // Update lesson progress in the list
      setLessonProgress(prev => 
        prev.map(p => 
          p.lessonId === lessonId ? data.lessonProgress : p
        )
      );
      
      return data.lessonProgress;
    } catch (err) {
      console.error('Error in updateLessonProgress:', err);
      throw err;
    }
  };

  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return lessonProgress.find(p => p.lessonId === lessonId);
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    const progress = getLessonProgress(lessonId);
    return progress?.isCompleted || false;
  };

  const getCompletedLessonsCount = (): number => {
    return lessonProgress.filter(p => p.isCompleted).length;
  };

  const getTotalTimeSpent = (): number => {
    return lessonProgress.reduce((total, p) => total + p.timeSpent, 0);
  };

  return {
    lessonProgress,
    loading,
    error,
    fetchLessonProgress,
    markLessonAsCompleted,
    updateLessonProgress,
    getLessonProgress,
    isLessonCompleted,
    getCompletedLessonsCount,
    getTotalTimeSpent
  };
};
