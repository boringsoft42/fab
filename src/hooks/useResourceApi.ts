import { useState, useEffect } from "react";
import { ResourceService } from "@/services/resource.service";
import { Resource } from "@/types/api";

export function useResources() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ResourceService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useResource(id: string) {
  const [data, setData] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    ResourceService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateResource() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<Resource>): Promise<Resource> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateResource() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<Resource>): Promise<Resource> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteResource() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para resources
export function useResourcesByType(type: string) {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!type) return;
    ResourceService.getByType(type)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [type]);

  return { data, loading, error };
}

export function useResourcesByCategory(category: string) {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!category) return;
    ResourceService.getByCategory(category)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [category]);

  return { data, loading, error };
}

export function usePublicResources() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ResourceService.getPublicResources()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useFeaturedResources() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ResourceService.getFeaturedResources()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useSearchResources() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (query: string): Promise<Resource[]> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.searchResources(query);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, error };
}

export function useResourcesByAuthor(authorId: string) {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authorId) return;
    ResourceService.getResourcesByAuthor(authorId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [authorId]);

  return { data, loading, error };
}

export function usePopularResources(limit: number = 10) {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ResourceService.getPopularResources(limit)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { data, loading, error };
}

export function useRecentResources(limit: number = 10) {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ResourceService.getRecentResources(limit)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { data, loading, error };
}

export function useDownloadResource() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const download = async (id: string): Promise<Blob> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.downloadResource(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { download, loading, error };
}

export function useIncrementDownloads() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const incrementDownloads = async (id: string): Promise<Resource> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.incrementDownloads(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { incrementDownloads, loading, error };
}

export function useRateResource() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const rateResource = async (id: string, rating: number): Promise<Resource> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.rateResource(id, rating);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { rateResource, loading, error };
}

export function useToggleResourcePublic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const togglePublic = async (id: string): Promise<Resource> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.togglePublic(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { togglePublic, loading, error };
}

export function useResourceStats(resourceId: string) {
  const [data, setData] = useState<{
    totalDownloads: number;
    averageRating: number;
    totalRatings: number;
    views: number;
    shares: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!resourceId) return;
    ResourceService.getResourceStats(resourceId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [resourceId]);

  return { data, loading, error };
}

export function useResourceCategories() {
  const [data, setData] = useState<{
    category: string;
    count: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ResourceService.getResourceCategories()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useResourceTypes() {
  const [data, setData] = useState<{
    type: string;
    count: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ResourceService.getResourceTypes()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useBulkUpdateResources() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkUpdate = async (resourceIds: string[], updates: Partial<Resource>): Promise<Resource[]> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.bulkUpdateResources(resourceIds, updates);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkUpdate, loading, error };
}

export function useBulkDeleteResources() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkDelete = async (resourceIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.bulkDeleteResources(resourceIds);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkDelete, loading, error };
}

export function useExportResources() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportResources = async (format: 'json' | 'csv' = 'json'): Promise<Blob> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.exportResources(format);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { exportResources, loading, error };
}

export function useImportResources() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const importResources = async (resources: Partial<Resource>[], format: 'json' | 'csv' = 'json'): Promise<Resource[]> => {
    setLoading(true);
    setError(null);
    try {
      return await ResourceService.importResources(resources, format);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { importResources, loading, error };
} 