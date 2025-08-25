import { useState, useCallback } from 'react';
import { UserProfile } from '@/types/api';
import { ProfileAvatarService } from '@/services/profile-avatar.service';

interface UseProfileAvatarReturn {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    getProfile: () => Promise<void>;
    updateAvatar: (file: File) => Promise<string>;
    updateProfile: (data: Partial<UserProfile>, file?: File) => Promise<UserProfile>;
    deleteProfile: () => Promise<boolean>;
    clearError: () => void;
}

export const useProfileAvatar = (): UseProfileAvatarReturn => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProfile = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const profileData = await ProfileAvatarService.getCurrentProfile();
            setProfile(profileData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener perfil';
            setError(errorMessage);
            console.error('Error getting profile:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAvatar = useCallback(async (file: File): Promise<string> => {
        if (!profile?.id) {
            throw new Error('No profile ID available');
        }

        setLoading(true);
        setError(null);

        try {
            // Validate file first
            const validation = ProfileAvatarService.validateImageFile(file);
            if (!validation.isValid) {
                throw new Error(validation.error || 'Error de validación');
            }

            const avatarUrl = await ProfileAvatarService.updateAvatar(profile.id, file);

            // Update local profile state
            setProfile(prev => prev ? { ...prev, avatarUrl } : null);

            return avatarUrl;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar avatar';
            setError(errorMessage);
            console.error('Error updating avatar:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    const updateProfile = useCallback(async (data: Partial<UserProfile>, file?: File): Promise<UserProfile> => {
        if (!profile?.id) {
            throw new Error('No profile ID available');
        }

        setLoading(true);
        setError(null);

        try {
            // Validate file if provided
            if (file) {
                const validation = ProfileAvatarService.validateImageFile(file);
                if (!validation.isValid) {
                    throw new Error(validation.error || 'Error de validación');
                }
            }

            const updatedProfile = await ProfileAvatarService.updateProfile(profile.id, data, file);

            // Update local profile state
            setProfile(updatedProfile);

            return updatedProfile;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil';
            setError(errorMessage);
            console.error('Error updating profile:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    const deleteProfile = useCallback(async (): Promise<boolean> => {
        if (!profile?.id) {
            throw new Error('No profile ID available');
        }

        setLoading(true);
        setError(null);

        try {
            const success = await ProfileAvatarService.deleteProfile(profile.id);

            if (success) {
                setProfile(null);
            }

            return success;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar perfil';
            setError(errorMessage);
            console.error('Error deleting profile:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        profile,
        loading,
        error,
        getProfile,
        updateAvatar,
        updateProfile,
        deleteProfile,
        clearError,
    };
};
