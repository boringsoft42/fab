import { apiCall } from '@/lib/api';
import { UserProfile } from '@/types/api';
import { BACKEND_ENDPOINTS } from '@/lib/backend-config';

export interface ProfileAvatarResponse {
    success: boolean;
    profile: UserProfile;
    avatarUrl?: string;
    message?: string;
}

export class ProfileAvatarService {
    /**
     * Get current user's profile (includes avatar)
     */
    static async getCurrentProfile(): Promise<UserProfile> {
        try {
            const response = await apiCall('/profile/me');
            return response;
        } catch (error) {
            console.error('Error getting current profile:', error);
            throw error;
        }
    }

    /**
     * Get profile by ID (includes avatar)
     */
    static async getProfileById(profileId: string): Promise<UserProfile> {
        try {
            const response = await apiCall(`/profile/${profileId}`);
            return response;
        } catch (error) {
            console.error('Error getting profile by ID:', error);
            throw error;
        }
    }

    /**
     * Update only avatar for a profile
     */
    static async updateAvatar(profileId: string, file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${BACKEND_ENDPOINTS.PROFILE_AVATAR}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ProfileAvatarResponse = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Error updating avatar');
            }

            return result.profile.avatarUrl || '';
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    }

    /**
     * Update complete profile (with or without avatar)
     */
    static async updateProfile(profileId: string, data: Partial<UserProfile>, file?: File): Promise<UserProfile> {
        try {
            const formData = new FormData();

            // Add profile data
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined) {
                    formData.append(key, data[key] as string);
                }
            });

            // Add avatar if provided
            if (file) {
                formData.append('avatar', file);
            }

            const response = await fetch(`${BACKEND_ENDPOINTS.PROFILE}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ProfileAvatarResponse = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Error updating profile');
            }

            return result.profile;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    /**
     * Delete profile (includes avatar)
     */
    static async deleteProfile(profileId: string): Promise<boolean> {
        try {
            const response = await fetch(`${BACKEND_ENDPOINTS.PROFILE}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            return response.status === 204;
        } catch (error) {
            console.error('Error deleting profile:', error);
            throw error;
        }
    }

    /**
     * Validate image file
     */
    static validateImageFile(file: File): { isValid: boolean; error?: string } {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)'
            };
        }

        // Check file size (5MB for MinIO)
        if (file.size > 5 * 1024 * 1024) {
            return {
                isValid: false,
                error: 'El archivo no puede exceder 5MB'
            };
        }

        return { isValid: true };
    }

    /**
     * Get token from localStorage
     */
    private static getToken(): string {
        if (typeof window === 'undefined') {
            throw new Error('Cannot access localStorage on server side');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        return token;
    }
}
