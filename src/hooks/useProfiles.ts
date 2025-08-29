import { useState, useEffect } from 'react';
import { profileService } from '@/services/profiles.service';
import { UserProfile, QueryParams } from '@/types/api';

// Hook for getting current user profile
export function useCurrentProfile() {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    profileService.getCurrentProfile()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await profileService.getCurrentProfile();
      setData(profile);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Hook for getting a specific user profile
export function useProfile(userId: string) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (userId === 'current') {
      profileService.getCurrentProfile()
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    } else {
      profileService.getProfile(userId)
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [userId]);

  return { data, loading, error };
}

// Hook for getting all profiles with pagination
export function useProfiles(params: QueryParams = {}) {
  const [data, setData] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    profileService.getprofile(params)
      .then(response => {
        setData(response.data);
        setPagination(response.pagination);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error, pagination };
}

// Hook for searching profiles
export function useSearchProfiles(searchCriteria: {
  name?: string;
  skills?: string[];
  location?: string;
  role?: string;
  interests?: string[];
}) {
  const [data, setData] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await profileService.searchprofile(searchCriteria);
      setData(results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.values(searchCriteria).some(value => value && (Array.isArray(value) ? value.length > 0 : true))) {
      search();
    }
  }, [JSON.stringify(searchCriteria)]);

  return { data, loading, error, search };
}

// Hook for updating profile
export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const updateProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileService.updateProfile(userId, profileData);
      return updatedProfile;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentProfile = async (profileData: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileService.updateCurrentProfile(profileData);
      return updatedProfile;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, updateCurrentProfile, loading, error };
}

// Hook for profile completion
export function useProfileCompletion(userId?: string) {
  const [data, setData] = useState<{ completionPercentage: number; missingFields: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    profileService.getProfileCompletion(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error };
}

// Hook for managing achievements
export function useAchievements() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const addAchievement = async (achievementData: {
    title: string;
    description: string;
    date: string;
    type: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileService.addAchievement(achievementData);
      return updatedProfile;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAchievement = async (achievementId: string, achievementData: {
    title?: string;
    description?: string;
    date?: string;
    type?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileService.updateAchievement(achievementId, achievementData);
      return updatedProfile;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (achievementId: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileService.deleteAchievement(achievementId);
      return updatedProfile;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addAchievement, updateAchievement, deleteAchievement, loading, error };
}

// Hook for avatar upload
export function useAvatarUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const uploadAvatar = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await profileService.uploadAvatar(file);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    setLoading(true);
    setError(null);
    try {
      await profileService.deleteAvatar();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadAvatar, deleteAvatar, loading, error };
} 