import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/api';

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

// Fetch certificates for a module
export const useModuleCertificates = (moduleId?: string) => {
  return useQuery({
    queryKey: ['moduleCertificates', moduleId],
    queryFn: async () => {
      if (!moduleId) return { certificates: [] };
      
      const params = new URLSearchParams({ moduleId });
      const response = await fetch(`http://localhost:3001/api/modulecertificate?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch module certificates');
      }
      
      return response.json();
    },
    enabled: !!moduleId,
  });
};

// Fetch certificates for a student
export const useStudentCertificates = (studentId?: string) => {
  return useQuery({
    queryKey: ['studentCertificates', studentId],
    queryFn: async () => {
      if (!studentId) return { certificates: [] };
      
      const params = new URLSearchParams({ studentId });
      const response = await fetch(`http://localhost:3001/api/modulecertificate?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch student certificates');
      }
      
      return response.json();
    },
    enabled: !!studentId,
  });
};

// Fetch a single certificate
export const useModuleCertificate = (certificateId?: string) => {
  return useQuery({
    queryKey: ['moduleCertificate', certificateId],
    queryFn: async () => {
      if (!certificateId) return null;
      
      const params = new URLSearchParams({ id: certificateId });
      const response = await fetch(`http://localhost:3001/api/modulecertificate?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch module certificate');
      }
      
      const data = await response.json();
      return data.certificate;
    },
    enabled: !!certificateId,
  });
};

// Create certificate mutation
export const useCreateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificateData: CreateCertificateData) => {
      const response = await fetch('http://localhost:3001/api/modulecertificate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(certificateData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create certificate');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch certificates
      queryClient.invalidateQueries({
        queryKey: ['moduleCertificates', variables.moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentCertificates', variables.studentId],
      });
    },
  });
};

// Update certificate mutation
export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificateData: UpdateCertificateData) => {
      const response = await fetch('http://localhost:3001/api/modulecertificate', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(certificateData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update certificate');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch certificates
      queryClient.invalidateQueries({
        queryKey: ['moduleCertificates'],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentCertificates'],
      });
      queryClient.invalidateQueries({
        queryKey: ['moduleCertificate', variables.id],
      });
    },
  });
};

// Delete certificate mutation
export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificateId: string) => {
      const params = new URLSearchParams({ id: certificateId });
      const response = await fetch(`http://localhost:3001/api/modulecertificate?${params}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete certificate');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch all certificates
      queryClient.invalidateQueries({
        queryKey: ['moduleCertificates'],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentCertificates'],
      });
    },
  });
};
