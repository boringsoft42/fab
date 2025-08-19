import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/api';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  content: string;
  contentType: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE';
  videoUrl?: string;
  duration?: number;
  orderIndex: number;
  isRequired: boolean;
  isPreview: boolean;
  attachments: any[];
  resources: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonData {
  moduleId: string;
  title: string;
  description?: string;
  content: string;
  contentType: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE';
  videoUrl?: string;
  duration?: number;
  orderIndex: number;
  isRequired?: boolean;
  isPreview?: boolean;
  attachments?: any[];
}

export interface UpdateLessonData extends Partial<CreateLessonData> {
  id: string;
}

// API functions
const fetchLessons = async (moduleId: string): Promise<{ lessons: Lesson[] }> => {
  const response = await fetch(`http://localhost:3001/api/lesson?moduleId=${moduleId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch lessons');
  }
  return response.json();
};

const createLesson = async (data: CreateLessonData): Promise<Lesson> => {
  const response = await fetch('http://localhost:3001/api/lesson', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create lesson');
  }
  return response.json();
};

const updateLesson = async (data: UpdateLessonData): Promise<Lesson> => {
  const response = await fetch(`http://localhost:3001/api/lesson/${data.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update lesson');
  }
  return response.json();
};

const deleteLesson = async (id: string): Promise<void> => {
  const response = await fetch(`http://localhost:3001/api/lesson/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete lesson');
  }
};

// React Query hooks
export const useModuleLessons = (moduleId: string) => {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => fetchLessons(moduleId),
    enabled: !!moduleId,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createLesson,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', data.moduleId] });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateLesson,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', data.moduleId] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteLesson,
    onSuccess: (_, variables) => {
      // Invalidate all lesson queries since we don't know the moduleId
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}; 