"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyApiService } from '@/services/company-api.service';

// Query keys
const COMPANY_KEYS = {
  all: ['companies'] as const,
  lists: () => [...COMPANY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...COMPANY_KEYS.lists(), { filters }] as const,
  details: () => [...COMPANY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COMPANY_KEYS.details(), id] as const,
  stats: () => [...COMPANY_KEYS.all, 'stats'] as const,
  byMunicipality: (municipalityId: string) => [...COMPANY_KEYS.all, 'municipality', municipalityId] as const,
};

// Get all companies (filtered by user's municipality automatically)
export const useCompanies = () => {
  return useQuery({
    queryKey: COMPANY_KEYS.lists(),
    queryFn: async () => {
      console.log("🔍 useCompanies - Calling CompanyApiService.getAll()");
      try {
        const result = await CompanyApiService.getAll();
        console.log("✅ useCompanies - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCompanies - Error:", error);
        throw error;
      }
    },
  });
};

// Get companies by specific municipality
export const useCompaniesByMunicipality = (municipalityId: string) => {
  return useQuery({
    queryKey: COMPANY_KEYS.byMunicipality(municipalityId),
    queryFn: async () => {
      console.log("🔍 useCompaniesByMunicipality - Calling CompanyApiService.searchByMunicipality() with id:", municipalityId);
      try {
        const result = await CompanyApiService.searchByMunicipality(municipalityId);
        console.log("✅ useCompaniesByMunicipality - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCompaniesByMunicipality - Error:", error);
        throw error;
      }
    },
    enabled: !!municipalityId,
  });
};

// Get company by ID
export const useCompany = (id: string) => {
  return useQuery({
    queryKey: COMPANY_KEYS.detail(id),
    queryFn: async () => {
      console.log("🔍 useCompany - Calling CompanyApiService.getById() with id:", id);
      try {
        const result = await CompanyApiService.getById(id);
        console.log("✅ useCompany - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCompany - Error:", error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

// Create company
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      console.log("🔍 useCreateCompany - Calling CompanyApiService.create() with data:", data);
      try {
        const result = await CompanyApiService.create(data);
        console.log("✅ useCreateCompany - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCreateCompany - Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.stats() });
    },
  });
};

// Get company statistics
export const useCompanyStats = () => {
  return useQuery({
    queryKey: COMPANY_KEYS.stats(),
    queryFn: async () => {
      console.log("📊 useCompanyStats - Calling CompanyApiService.getStats()");
      try {
        const result = await CompanyApiService.getStats();
        console.log("✅ useCompanyStats - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCompanyStats - Error:", error);
        throw error;
      }
    },
  });
};

// Update company
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log("🔍 useUpdateCompany - Calling CompanyApiService.update() with id:", id, "data:", data);
      try {
        const result = await CompanyApiService.update(id, data);
        console.log("✅ useUpdateCompany - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useUpdateCompany - Error:", error);
        throw error;
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.stats() });
    },
  });
};

// Delete company
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("🔍 useDeleteCompany - Calling CompanyApiService.delete() with id:", id);
      try {
        const result = await CompanyApiService.delete(id);
        console.log("✅ useDeleteCompany - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useDeleteCompany - Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.stats() });
    },
  });
}; 