import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/api';

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: Date;
  timeSpent: number; // in minutes
  videoProgress: number; // 0.0 to 1.0 (0% to 100%)
  lastWatchedAt?: Date;
}

export interface CreateProgressData {
  enrollmentId: string;
  lessonId: string;
  isCompleted?: boolean;
  timeSpent?: number;
  videoProgress?: number;
}

export interface UpdateProgressData {
  id: string;
  isCompleted?: boolean;
  timeSpent?: number;
  videoProgress?: number;
}

export interface CourseProgress {
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  timeSpent: number;
  lastActivity: Date;
  modules: {
    moduleId: string;
    title: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
  }[];
}

// Fetch progress for a specific lesson
export const useLessonProgress = (enrollmentId?: string, lessonId?: string) => {
  return useQuery({
    queryKey: ['lessonProgress', enrollmentId, lessonId],
    queryFn: async () => {
      if (!enrollmentId || !lessonId) return null;
      
      const params = new URLSearchParams({ 
        enrollmentId, 
        lessonId 
      });
      const response = await fetch(`http://localhost:3001/api/lessonprogress?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson progress');
      }
      
      const data = await response.json();
      return data.progress;
    },
    enabled: !!enrollmentId && !!lessonId,
  });
};

// Fetch all progress for an enrollment
export const useEnrollmentProgress = (enrollmentId?: string) => {
  return useQuery({
    queryKey: ['enrollmentProgress', enrollmentId],
    queryFn: async () => {
      if (!enrollmentId) return { progress: [] };
      
      const params = new URLSearchParams({ enrollmentId });
      const response = await fetch(`http://localhost:3001/api/lessonprogress?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch enrollment progress');
      }
      
      return response.json();
    },
    enabled: !!enrollmentId,
  });
};

// Fetch course progress overview
export const useCourseProgress = (courseId?: string) => {
  return useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      
      const params = new URLSearchParams({ courseId });
      const response = await fetch(`http://localhost:3001/api/lessonprogress?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch course progress');
      }
      
      const data = await response.json();
      return data.courseProgress as CourseProgress;
    },
    enabled: !!courseId,
  });
};

// Create/Update progress mutation
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progressData: CreateProgressData) => {
      const response = await fetch('http://localhost:3001/api/lessonprogress', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(progressData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch progress
      queryClient.invalidateQueries({
        queryKey: ['lessonProgress', variables.enrollmentId, variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: ['enrollmentProgress', variables.enrollmentId],
      });
    },
  });
};

// Update specific progress record
export const useUpdateProgressRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progressData: UpdateProgressData) => {
      const response = await fetch('http://localhost:3001/api/lessonprogress', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(progressData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress record');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch progress
      queryClient.invalidateQueries({
        queryKey: ['lessonProgress'],
      });
      queryClient.invalidateQueries({
        queryKey: ['enrollmentProgress'],
      });
    },
  });
};

// Delete progress mutation
export const useDeleteProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progressId: string) => {
      const params = new URLSearchParams({ id: progressId });
      const response = await fetch(`http://localhost:3001/api/lessonprogress?${params}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete progress');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch all progress
      queryClient.invalidateQueries({
        queryKey: ['lessonProgress'],
      });
      queryClient.invalidateQueries({
        queryKey: ['enrollmentProgress'],
      });
    },
  });
}; 