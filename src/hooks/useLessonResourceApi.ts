import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/api';

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  type: 'PDF' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'LINK' | 'ZIP' | 'OTHER';
  url: string;
  filePath?: string;
  fileSize?: number;
  orderIndex: number;
  isDownloadable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResourceData {
  lessonId: string;
  title: string;
  description?: string;
  type: 'PDF' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'LINK' | 'ZIP' | 'OTHER';
  url: string;
  filePath?: string;
  fileSize?: number;
  orderIndex: number;
  isDownloadable?: boolean;
}

export interface UpdateResourceData {
  id: string;
  title?: string;
  description?: string;
  type?: 'PDF' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'LINK' | 'ZIP' | 'OTHER';
  url?: string;
  filePath?: string;
  fileSize?: number;
  orderIndex?: number;
  isDownloadable?: boolean;
}

// Fetch resources for a lesson
export const useLessonResources = (lessonId?: string) => {
  return useQuery({
    queryKey: ['lessonResources', lessonId],
    queryFn: async () => {
      if (!lessonId) return { resources: [] };
      
      const params = new URLSearchParams({ lessonId });
      const response = await fetch(`http://localhost:3001/api/lessonresource?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson resources');
      }
      
      return response.json();
    },
    enabled: !!lessonId,
  });
};

// Fetch a single resource
export const useLessonResource = (resourceId?: string) => {
  return useQuery({
    queryKey: ['lessonResource', resourceId],
    queryFn: async () => {
      if (!resourceId) return null;
      
      const params = new URLSearchParams({ id: resourceId });
      const response = await fetch(`http://localhost:3001/api/lessonresource?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson resource');
      }
      
      const data = await response.json();
      return data.resource;
    },
    enabled: !!resourceId,
  });
};

// Create resource mutation
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resourceData: CreateResourceData) => {
      const response = await fetch('http://localhost:3001/api/lessonresource', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resourceData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create resource');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch resources for the lesson
      queryClient.invalidateQueries({
        queryKey: ['lessonResources', variables.lessonId],
      });
    },
  });
};

// Update resource mutation
export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resourceData: UpdateResourceData) => {
      const response = await fetch('http://localhost:3001/api/lessonresource', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(resourceData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update resource');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch resources
      queryClient.invalidateQueries({
        queryKey: ['lessonResources'],
      });
      queryClient.invalidateQueries({
        queryKey: ['lessonResource', variables.id],
      });
    },
  });
};

// Delete resource mutation
export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resourceId: string) => {
      const params = new URLSearchParams({ id: resourceId });
      const response = await fetch(`http://localhost:3001/api/lessonresource?${params}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch all resources
      queryClient.invalidateQueries({
        queryKey: ['lessonResources'],
      });
    },
  });
};
