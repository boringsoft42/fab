import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobOfferService, CreateJobOfferRequest, UpdateJobOfferRequest } from '@/services/job-offer.service';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/hooks/use-auth';

// Hook para obtener puestos de trabajo de la empresa
export function useCompanyJobOffers(companyId: string, status?: string) {
  return useQuery({
    queryKey: ['company-job-offers', companyId, status],
    queryFn: () => JobOfferService.getCompanyJobOffers(companyId, status),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook para obtener puestos activos (para jóvenes)
export function useActiveJobOffers() {
  return useQuery({
    queryKey: ['active-job-offers'],
    queryFn: JobOfferService.getActiveJobOffers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook para obtener un puesto específico
export function useJobOffer(id: string) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ['job-offer', id],
    queryFn: () => JobOfferService.getJobOffer(id),
    enabled: !!id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook para crear un puesto de trabajo
export function useCreateJobOffer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateJobOfferRequest) => JobOfferService.createJobOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-job-offers'] });
      toast({
        title: "Éxito",
        description: "Puesto de trabajo creado exitosamente",
      });
    },
    onError: (error) => {
      console.error('Error creating job offer:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el puesto de trabajo",
        variant: "destructive",
      });
    },
  });
}

// Hook para actualizar un puesto de trabajo
export function useUpdateJobOffer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobOfferRequest }) =>
      JobOfferService.updateJobOffer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['company-job-offers'] });
      queryClient.invalidateQueries({ queryKey: ['job-offer', id] });
      toast({
        title: "Éxito",
        description: "Puesto de trabajo actualizado exitosamente",
      });
    },
    onError: (error) => {
      console.error('Error updating job offer:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el puesto de trabajo",
        variant: "destructive",
      });
    },
  });
}

// Hook para cerrar un puesto de trabajo
export function useCloseJobOffer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => JobOfferService.closeJobOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-job-offers'] });
      toast({
        title: "Éxito",
        description: "Puesto de trabajo cerrado exitosamente",
      });
    },
    onError: (error) => {
      console.error('Error closing job offer:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar el puesto de trabajo",
        variant: "destructive",
      });
    },
  });
}

// Hook para pausar un puesto de trabajo
export function usePauseJobOffer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => JobOfferService.pauseJobOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-job-offers'] });
      toast({
        title: "Éxito",
        description: "Puesto de trabajo pausado exitosamente",
      });
    },
    onError: (error) => {
      console.error('Error pausing job offer:', error);
      toast({
        title: "Error",
        description: "No se pudo pausar el puesto de trabajo",
        variant: "destructive",
      });
    },
  });
}

// Hook para activar un puesto de trabajo
export function useActivateJobOffer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => JobOfferService.activateJobOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-job-offers'] });
      toast({
        title: "Éxito",
        description: "Puesto de trabajo activado exitosamente",
      });
    },
    onError: (error) => {
      console.error('Error activating job offer:', error);
      toast({
        title: "Error",
        description: "No se pudo activar el puesto de trabajo",
        variant: "destructive",
      });
    },
  });
}
