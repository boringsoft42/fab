import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCall, API_BASE, getAuthHeaders } from '@/lib/api';

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
  url?: string;
  filePath?: string;
  fileSize?: number;
  orderIndex?: number;
  isDownloadable?: boolean;
  file?: File; // Para subida de archivos a MinIO
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
  file?: File; // Para subida de archivos a MinIO
}

export interface ResourceFilters {
  lessonId?: string;
  moduleId?: string;
  type?: string;
  isPublic?: boolean;
}

// Fetch resources for a lesson
export const useLessonResources = (filters?: ResourceFilters) => {
  return useQuery({
    queryKey: ['lessonResources', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.lessonId) params.append('lessonId', filters.lessonId);
      if (filters?.moduleId) params.append('moduleId', filters.moduleId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());

      const data = await apiCall(`/lessonresource?${params}`);
      return data;
    },
  });
};

// Fetch a single resource
export const useLessonResource = (resourceId?: string) => {
  return useQuery({
    queryKey: ['lessonResource', resourceId],
    queryFn: async () => {
      if (!resourceId) return null;

      const params = new URLSearchParams({ id: resourceId });
      const response = await fetch(`${API_BASE}/lessonresource?${params}`, {
        headers: getAuthHeaders(),
      });

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
      // Si hay un archivo, usar FormData
      if (resourceData.file) {
        const formData = new FormData();

        // Agregar campos de texto
        formData.append('lessonId', resourceData.lessonId);
        formData.append('title', resourceData.title);
        if (resourceData.description) formData.append('description', resourceData.description);
        formData.append('type', resourceData.type);
        if (resourceData.url) formData.append('url', resourceData.url);
        if (resourceData.orderIndex) formData.append('orderIndex', resourceData.orderIndex.toString());
        if (resourceData.isDownloadable !== undefined) formData.append('isDownloadable', resourceData.isDownloadable.toString());

        // Agregar archivo
        formData.append('file', resourceData.file);

        const response = await fetch(`${API_BASE}/lessonresource`, {
          method: 'POST',
          headers: getAuthHeaders(true), // true para FormData
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to create resource');
        }

        return response.json();
      } else {
        // Sin archivo, usar JSON
        const response = await fetch(`${API_BASE}/lessonresource`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(resourceData),
        });

        if (!response.ok) {
          throw new Error('Failed to create resource');
        }

        return response.json();
      }
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
      // Si hay un archivo, usar FormData
      if (resourceData.file) {
        const formData = new FormData();

        // Agregar campos de texto
        formData.append('id', resourceData.id);
        if (resourceData.title) formData.append('title', resourceData.title);
        if (resourceData.description) formData.append('description', resourceData.description);
        if (resourceData.type) formData.append('type', resourceData.type);
        if (resourceData.url) formData.append('url', resourceData.url);
        if (resourceData.orderIndex) formData.append('orderIndex', resourceData.orderIndex.toString());
        if (resourceData.isDownloadable !== undefined) formData.append('isDownloadable', resourceData.isDownloadable.toString());

        // Agregar archivo
        formData.append('file', resourceData.file);

        const response = await fetch(`${API_BASE}/lessonresource/${resourceData.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(true), // true para FormData
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to update resource');
        }

        return response.json();
      } else {
        // Sin archivo, usar JSON
        const response = await fetch(`${API_BASE}/lessonresource/${resourceData.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(resourceData),
        });

        if (!response.ok) {
          throw new Error('Failed to update resource');
        }

        return response.json();
      }
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
      const response = await fetch(`${API_BASE}/lessonresource/${resourceId}`, {
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
