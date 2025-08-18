"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MunicipalityService } from '@/services/municipality.service';
import type { 
  Municipality, 
  CreateMunicipalityRequest, 
  UpdateMunicipalityRequest,
  MunicipalityAuthRequest,
  MunicipalityChangePasswordRequest
} from '@/types/municipality';

// Query keys
const MUNICIPALITY_KEYS = {
  all: ['municipalities'] as const,
  lists: () => [...MUNICIPALITY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...MUNICIPALITY_KEYS.lists(), { filters }] as const,
  details: () => [...MUNICIPALITY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...MUNICIPALITY_KEYS.details(), id] as const,
};

// Get all municipalities
export const useMunicipalities = () => {
  return useQuery({
    queryKey: MUNICIPALITY_KEYS.lists(),
    queryFn: MunicipalityService.getAll,
  });
};

// Get municipality by ID
export const useMunicipality = (id: string) => {
  return useQuery({
    queryKey: MUNICIPALITY_KEYS.detail(id),
    queryFn: () => MunicipalityService.getById(id),
    enabled: !!id,
  });
};

// Create municipality
export const useCreateMunicipality = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMunicipalityRequest) => MunicipalityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUNICIPALITY_KEYS.lists() });
    },
  });
};

// Update municipality
export const useUpdateMunicipality = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMunicipalityRequest }) =>
      MunicipalityService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: MUNICIPALITY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: MUNICIPALITY_KEYS.detail(id) });
    },
  });
};

// Delete municipality
export const useDeleteMunicipality = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => MunicipalityService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUNICIPALITY_KEYS.lists() });
    },
  });
};

// Municipality authentication
export const useMunicipalityLogin = () => {
  return useMutation({
    mutationFn: (credentials: MunicipalityAuthRequest) => MunicipalityService.login(credentials),
  });
};

// Get current municipality
export const useCurrentMunicipality = () => {
  return useQuery({
    queryKey: ['municipality', 'current'],
    queryFn: MunicipalityService.getCurrentMunicipality,
  });
};

// Change municipality password
export const useChangeMunicipalityPassword = () => {
  return useMutation({
    mutationFn: (data: MunicipalityChangePasswordRequest) => MunicipalityService.changePassword(data),
  });
}; 