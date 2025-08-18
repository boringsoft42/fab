import { useState, useEffect } from "react";
import { ProfileService } from "@/services/profile.service";
import { Profile } from "@/types/profile";

export function useProfiles() {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ProfileService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useProfile(id: string) {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    ProfileService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<Profile>): Promise<Profile> => {
    setLoading(true);
    setError(null);
    try {
      return await ProfileService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<Profile>): Promise<Profile> => {
    setLoading(true);
    setError(null);
    try {
      return await ProfileService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await ProfileService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para profiles
export function useCurrentProfile() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ProfileService.getCurrentProfile()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useUpdateCurrentProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (data: Partial<Profile>): Promise<Profile> => {
    setLoading(true);
    setError(null);
    try {
      return await ProfileService.updateCurrentProfile(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useProfilesByRole(role: string) {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!role) return;
    ProfileService.getByRole(role)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [role]);

  return { data, loading, error };
}

export function useSearchProfiles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (query: string): Promise<Profile[]> => {
    setLoading(true);
    setError(null);
    try {
      return await ProfileService.searchProfiles(query);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, error };
}

export function useProfilesByMunicipality(municipality: string) {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!municipality) return;
    ProfileService.getByMunicipality(municipality)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [municipality]);

  return { data, loading, error };
}

export function useProfilesByDepartment(department: string) {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!department) return;
    ProfileService.getByDepartment(department)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [department]);

  return { data, loading, error };
}

export function useActiveProfiles() {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ProfileService.getActiveProfiles()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useProfileCompletion(id: string) {
  const [data, setData] = useState<{
    completionPercentage: number;
    missingFields: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    ProfileService.getProfileCompletion(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useUploadAvatar() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (file: File): Promise<{ avatarUrl: string }> => {
    setLoading(true);
    setError(null);
    try {
      return await ProfileService.uploadAvatar(file);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
}

export function useDeleteAvatar() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteAvatar = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await ProfileService.deleteAvatar();
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { deleteAvatar, loading, error };
} 