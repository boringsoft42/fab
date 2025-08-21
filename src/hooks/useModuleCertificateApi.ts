import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCall } from '@/lib/api';

export interface ModuleCertificate {
  id: string;
  moduleId: string;
  studentId: string;
  certificateUrl: string;
  issuedAt: Date;
  grade?: number;
  completedAt: Date;
}

export interface CreateCertificateData {
  moduleId: string;
  studentId: string;
  certificateUrl: string;
  grade?: number;
}

export interface UpdateCertificateData {
  id: string;
  certificateUrl?: string;
  grade?: number;
}

// Fetch module certificates
export const useModuleCertificates = (filters?: CertificateFilters) => {
  return useQuery({
    queryKey: ['moduleCertificates', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.moduleId) params.append('moduleId', filters.moduleId);
      if (filters?.studentId) params.append('studentId', filters.studentId);
      if (filters?.courseId) params.append('courseId', filters.courseId);
      
      const data = await apiCall(`/modulecertificate?${params}`);
      return data;
    },
  });
};

// Fetch a single module certificate
export const useModuleCertificate = (certificateId?: string) => {
  return useQuery({
    queryKey: ['moduleCertificate', certificateId],
    queryFn: async () => {
      if (!certificateId) return null;
      
      const params = new URLSearchParams({ id: certificateId });
      const data = await apiCall(`/modulecertificate?${params}`);
      return data;
    },
    enabled: !!certificateId,
  });
};

// Create module certificate mutation
export const useCreateModuleCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificateData: CreateCertificateData) => {
      const data = await apiCall('/modulecertificate', {
        method: 'POST',
        body: JSON.stringify(certificateData),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleCertificates'] });
    },
  });
};

// Update module certificate mutation
export const useUpdateModuleCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificateData: UpdateCertificateData) => {
      const data = await apiCall('/modulecertificate', {
        method: 'PUT',
        body: JSON.stringify(certificateData),
      });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moduleCertificates'] });
      queryClient.invalidateQueries({ queryKey: ['moduleCertificate', variables.id] });
    },
  });
};

// Delete module certificate mutation
export const useDeleteModuleCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificateId: string) => {
      const params = new URLSearchParams({ id: certificateId });
      const data = await apiCall(`/modulecertificate?${params}`, {
        method: 'DELETE',
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleCertificates'] });
    },
  });
};
