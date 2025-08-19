import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthHeaders } from '@/lib/api';

interface VideoUploadData {
  title: string;
  description: string;
  content: string;
  moduleId: string;
  contentType: string;
  duration: number;
  orderIndex: number;
  isRequired: boolean;
  isPreview: boolean;
  video: File;
}

interface MultipleFilesUploadData extends Omit<VideoUploadData, 'video'> {
  video?: File;
  thumbnail?: File;
  attachments?: File[];
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  bucket: string;
}

interface UploadResponse {
  id: string;
  title: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  attachments?: string[];
  uploadedFiles: {
    video?: UploadedFile;
    thumbnail?: UploadedFile;
    attachments?: UploadedFile[];
  };
}

// Upload single video
const uploadVideo = async (data: VideoUploadData): Promise<UploadResponse> => {
  const formData = new FormData();
  
  // Add lesson data
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('content', data.content);
  formData.append('moduleId', data.moduleId);
  formData.append('contentType', data.contentType);
  formData.append('duration', data.duration.toString());
  formData.append('orderIndex', data.orderIndex.toString());
  formData.append('isRequired', data.isRequired.toString());
  formData.append('isPreview', data.isPreview.toString());
  
  // Add video file
  formData.append('video', data.video);

          const response = await fetch('http://localhost:3001/api/lesson/with-video', {
    method: 'POST',
    headers: getAuthHeaders(true), // excludeContentType = true for FormData
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload video');
  }

  return response.json();
};

// Upload multiple files
const uploadMultipleFiles = async (data: MultipleFilesUploadData): Promise<UploadResponse> => {
  const formData = new FormData();
  
  // Add lesson data
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('content', data.content);
  formData.append('moduleId', data.moduleId);
  formData.append('contentType', data.contentType);
  formData.append('duration', data.duration.toString());
  formData.append('orderIndex', data.orderIndex.toString());
  formData.append('isRequired', data.isRequired.toString());
  formData.append('isPreview', data.isPreview.toString());
  
  // Add video file
  if (data.video) {
    formData.append('video', data.video);
  }
  
  // Add thumbnail file
  if (data.thumbnail) {
    formData.append('thumbnail', data.thumbnail);
  }
  
  // Add attachment files
  if (data.attachments) {
    data.attachments.forEach(attachment => {
      formData.append('attachments', attachment);
    });
  }

          const response = await fetch('http://localhost:3001/api/lesson/with-files', {
    method: 'POST',
    headers: getAuthHeaders(true), // excludeContentType = true for FormData
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload files');
  }

  return response.json();
};

export const useLessonVideoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const queryClient = useQueryClient();

  const uploadVideoMutation = useMutation({
    mutationFn: uploadVideo,
    onSuccess: (data) => {
      toast.success('Video uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setUploadProgress(null);
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploadProgress(null);
    },
  });

  const uploadMultipleFilesMutation = useMutation({
    mutationFn: uploadMultipleFiles,
    onSuccess: (data) => {
      toast.success('Files uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setUploadProgress(null);
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploadProgress(null);
    },
  });

  const uploadVideoWithProgress = async (data: VideoUploadData) => {
    try {
      setUploadProgress({ loaded: 0, total: data.video.size, percentage: 0 });
      
      // Simulate progress (in real implementation, you'd use XMLHttpRequest or fetch with progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (!prev) return prev;
          const newLoaded = Math.min(prev.loaded + prev.total / 20, prev.total);
          const newPercentage = Math.round((newLoaded / prev.total) * 100);
          return { ...prev, loaded: newLoaded, percentage: newPercentage };
        });
      }, 100);

      const result = await uploadVideoMutation.mutateAsync(data);
      
      clearInterval(progressInterval);
      setUploadProgress({ loaded: data.video.size, total: data.video.size, percentage: 100 });
      
      return result;
    } catch (error) {
      setUploadProgress(null);
      throw error;
    }
  };

  const uploadMultipleFilesWithProgress = async (data: MultipleFilesUploadData) => {
    try {
      const totalSize = [
        data.video?.size || 0,
        data.thumbnail?.size || 0,
        ...(data.attachments?.map(f => f.size) || [])
      ].reduce((sum, size) => sum + size, 0);
      
      setUploadProgress({ loaded: 0, total: totalSize, percentage: 0 });
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (!prev) return prev;
          const newLoaded = Math.min(prev.loaded + prev.total / 20, prev.total);
          const newPercentage = Math.round((newLoaded / prev.total) * 100);
          return { ...prev, loaded: newLoaded, percentage: newPercentage };
        });
      }, 100);

      const result = await uploadMultipleFilesMutation.mutateAsync(data);
      
      clearInterval(progressInterval);
      setUploadProgress({ loaded: totalSize, total: totalSize, percentage: 100 });
      
      return result;
    } catch (error) {
      setUploadProgress(null);
      throw error;
    }
  };

  return {
    uploadVideo: uploadVideoMutation.mutate,
    uploadVideoAsync: uploadVideoMutation.mutateAsync,
    uploadVideoWithProgress,
    uploadMultipleFiles: uploadMultipleFilesMutation.mutate,
    uploadMultipleFilesAsync: uploadMultipleFilesMutation.mutateAsync,
    uploadMultipleFilesWithProgress,
    isUploading: uploadVideoMutation.isPending || uploadMultipleFilesMutation.isPending,
    uploadProgress,
    error: uploadVideoMutation.error || uploadMultipleFilesMutation.error,
  };
};
