import { useState } from 'react';
import { EntrepreneurshipService } from '@/services/entrepreneurship.service';
import { Entrepreneurship } from '@/types/profile';

export const useCreateEntrepreneurship = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await EntrepreneurshipService.createEntrepreneurship(data);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al crear emprendimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export const useMyEntrepreneurships = () => {
  const [entrepreneurships, setEntrepreneurships] = useState<Entrepreneurship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEntrepreneurships = async () => {
    console.log("🔍 useMyEntrepreneurships - Starting fetch");
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 useMyEntrepreneurships - Calling EntrepreneurshipService.getMyEntrepreneurships()");
      const result = await EntrepreneurshipService.getMyEntrepreneurships();
      console.log("🔍 useMyEntrepreneurships - Service result:", result);
      console.log("🔍 useMyEntrepreneurships - Result items:", result.items);
      setEntrepreneurships(result.items || []);
      return result;
    } catch (err: any) {
      console.error("🔍 useMyEntrepreneurships - Error:", err);
      setError(err.message || 'Error al cargar emprendimientos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { entrepreneurships, loading, error, fetchMyEntrepreneurships };
};

export const useAllEntrepreneurships = () => {
  const [entrepreneurships, setEntrepreneurships] = useState<Entrepreneurship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllEntrepreneurships = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await EntrepreneurshipService.getAllEntrepreneurships(filters);
      setEntrepreneurships(result.items || []);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al cargar emprendimientos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { entrepreneurships, loading, error, fetchAllEntrepreneurships };
};

export const useEntrepreneurship = (id: string) => {
  const [entrepreneurship, setEntrepreneurship] = useState<Entrepreneurship | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntrepreneurship = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await EntrepreneurshipService.getEntrepreneurship(id);
      setEntrepreneurship(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al cargar emprendimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { entrepreneurship, loading, error, fetchEntrepreneurship };
};

export const useUpdateEntrepreneurship = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await EntrepreneurshipService.updateEntrepreneurship(id, data);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar emprendimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export const useDeleteEntrepreneurship = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEntrepreneurship = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await EntrepreneurshipService.deleteEntrepreneurship(id);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar emprendimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteEntrepreneurship, loading, error };
};

// Hooks específicos para entrepreneurship
export function useEntrepreneurshipsByOwner(ownerId: string) {
  const [data, setData] = useState<Entrepreneurship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ownerId) return;
    EntrepreneurshipService.getByOwner(ownerId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [ownerId]);

  return { data, loading, error };
}

export function useEntrepreneurshipsByCategory(category: string) {
  const [data, setData] = useState<Entrepreneurship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!category) return;
    EntrepreneurshipService.getByCategory(category)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [category]);

  return { data, loading, error };
}

export function useEntrepreneurshipsByMunicipality(municipality: string) {
  const [data, setData] = useState<Entrepreneurship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!municipality) return;
    EntrepreneurshipService.getByMunicipality(municipality)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [municipality]);

  return { data, loading, error };
}

export function usePublicEntrepreneurships() {
  const [data, setData] = useState<Entrepreneurship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    EntrepreneurshipService.getPublic()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useIncrementViews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const increment = async (id: string): Promise<Entrepreneurship> => {
    setLoading(true);
    setError(null);
    try {
      return await EntrepreneurshipService.incrementViews(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { increment, loading, error };
} 