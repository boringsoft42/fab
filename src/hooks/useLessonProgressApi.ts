import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCall } from '@/lib/api';

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
      const data = await apiCall(`/lessonprogress?${params}`);
      return data;
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
      const data = await apiCall(`/lessonprogress?${params}`);
      return data;
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
      const data = await apiCall(`/lessonprogress?${params}`);
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
      const data = await apiCall('/lessonprogress', {
        method: 'POST',
        body: JSON.stringify(progressData),
      });
      return data;
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
      const data = await apiCall('/lessonprogress', {
        method: 'PUT',
        body: JSON.stringify(progressData),
      });
      return data;
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
      const data = await apiCall(`/lessonprogress?${params}`, { method: 'DELETE' });
      return data;
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