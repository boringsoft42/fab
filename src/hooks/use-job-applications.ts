import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobApplicationService, CreateJobApplicationRequest, UpdateJobApplicationRequest } from '@/services/job-application.service';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/hooks/use-auth';

// Hook para obtener aplicaciones de la empresa
export function useCompanyApplications() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ['company-applications'],
    queryFn: async () => {
      const response = await JobApplicationService.getCompanyApplications();
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: isAuthenticated, // Only run when user is authenticated
  });
}

// Hook para obtener aplicaciones del usuario
export function useUserApplications() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ['user-applications'],
    queryFn: async () => {
      const response = await JobApplicationService.getUserApplications();
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: isAuthenticated, // Only run when user is authenticated
  });
}

// Hook para obtener una aplicación específica
export function useJobApplication(id: string) {
  return useQuery({
    queryKey: ['job-application', id],
    queryFn: () => JobApplicationService.getJobApplication(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook para crear una aplicación
export function useCreateJobApplication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateJobApplicationRequest) => JobApplicationService.createJobApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      toast({
        title: "Éxito",
        description: "Aplicación enviada exitosamente",
      });
    },
    onError: (error) => {
      console.error('Error creating job application:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la aplicación",
        variant: "destructive",
      });
    },
  });
}

// Hook para actualizar estado de aplicación (empresas)
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobApplicationRequest }) =>
      JobApplicationService.updateApplicationStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-application', id] });
      toast({
        title: "Éxito",
        description: "Estado de aplicación actualizado",
      });
    },
    onError: (error) => {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la aplicación",
        variant: "destructive",
      });
    },
  });
}

// Hook para actualizar aplicación del usuario
export function useUpdateUserApplication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobApplicationRequest }) =>
      JobApplicationService.updateUserApplication(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-application', id] });
      toast({
        title: "Éxito",
        description: "Aplicación actualizada exitosamente",
      });
    },
    onError: (error) => {
      console.error('Error updating user application:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la aplicación",
        variant: "destructive",
      });
    },
  });
}

// Hook para contratar candidato
export function useHireCandidate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, notes, rating }: { id: string; notes?: string; rating?: number }) =>
      JobApplicationService.hireCandidate(id, notes, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "¡Candidato Contratado!",
        description: "El candidato ha sido contratado exitosamente",
      });
    },
    onError: (error) => {
      console.error('Error hiring candidate:', error);
      toast({
        title: "Error",
        description: "No se pudo contratar al candidato",
        variant: "destructive",
      });
    },
  });
}

// Hook para rechazar candidato
export function useRejectCandidate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, notes, rating }: { id: string; notes?: string; rating?: number }) =>
      JobApplicationService.rejectCandidate(id, notes, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "Candidato Rechazado",
        description: "El candidato ha sido rechazado",
      });
    },
    onError: (error) => {
      console.error('Error rejecting candidate:', error);
      toast({
        title: "Error",
        description: "No se pudo rechazar al candidato",
        variant: "destructive",
      });
    },
  });
}

// Hook para preseleccionar candidato
export function usePreselectCandidate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, notes, rating }: { id: string; notes?: string; rating?: number }) =>
      JobApplicationService.preselectCandidate(id, notes, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "Candidato Preseleccionado",
        description: "El candidato ha sido preseleccionado para entrevista",
      });
    },
    onError: (error) => {
      console.error('Error preselecting candidate:', error);
      toast({
        title: "Error",
        description: "No se pudo preseleccionar al candidato",
        variant: "destructive",
      });
    },
  });
}
