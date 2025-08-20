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

// Fetch resources for a lesson
export const useLessonResources = (lessonId?: string) => {
  return useQuery({
    queryKey: ['lessonResources', lessonId],
    queryFn: async () => {
      if (!lessonId) {
        return { resources: [] };
      }
      
      const params = new URLSearchParams({ lessonId });
      const url = `http://localhost:3001/api/lessonresource?${params}`;
      
      const headers = getAuthHeaders();
      
      const response = await fetch(url, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson resources');
      }
      
      const data = await response.json();
      
      // Si la respuesta es un array directo, lo envuelvo en el formato esperado
      if (Array.isArray(data)) {
        return { resources: data };
      }
      
      return data;
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
      const response = await fetch(`http://localhost:3001/api/lessonresource?${params}`, {
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
        
        const response = await fetch('http://localhost:3001/api/lessonresource', {
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
        const response = await fetch('http://localhost:3001/api/lessonresource', {
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
        
        const response = await fetch(`http://localhost:3001/api/lessonresource/${resourceData.id}`, {
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
        const response = await fetch(`http://localhost:3001/api/lessonresource/${resourceData.id}`, {
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
      const response = await fetch(`http://localhost:3001/api/lessonresource/${resourceId}`, {
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
