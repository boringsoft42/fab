import { useState, useEffect } from 'react';

interface Company {
  id: string;
  name: string;
  description?: string;
  businessSector?: string;
  companySize?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  foundedYear?: number;
  isActive: boolean;
  municipality: {
    id: string;
    name: string;
    department: string;
  };
}

interface SearchFilters {
  query?: string;
  businessSector?: string;
  companySize?: string;
  municipalityId?: string;
  department?: string;
  foundedYear?: number;
  isActive?: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SearchResponse {
  companies: Company[];
  pagination: Pagination;
  filters: {
    applied: SearchFilters;
    available: {
      businessSectors: string[];
      companySizes: string[];
      municipalities: any[];
      departments: string[];
    };
  };
}

export const useCompanySearch = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const searchCompanies = async (searchParams: SearchFilters & { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: string 
  }) => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const params = new URLSearchParams();
      
      // Add search parameters
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/company/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error searching companies: ${response.status} ${errorText}`);
      }

      const data: SearchResponse = await response.json();
      
      setCompanies(data.companies);
      setPagination(data.pagination);
      setFilters(data.filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error in searchCompanies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    searchCompanies({ page: 1, limit: 20 });
  }, []);

  return {
    companies,
    pagination,
    filters,
    loading,
    error,
    searchCompanies
  };
};
