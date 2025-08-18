import { apiCall } from '@/lib/api';
import { UserProfile, QueryParams, PaginatedResponse, ApiResponse } from '@/types/api';

export class profileService {
  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<UserProfile> {
    return await apiCall(`/profile/${userId}`);
  }

  /**
   * Get current user's profile
   */
  static async getCurrentProfile(): Promise<UserProfile> {
    return await apiCall('/profile/me');
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    return await apiCall(`/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  /**
   * Update current user's profile
   */
  static async updateCurrentProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return await apiCall('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  /**
   * Get all profile (with pagination and filtering)
   */
  static async getprofile(params: QueryParams = {}): Promise<PaginatedResponse<UserProfile>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    
    // Add filter parameters
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/profile?${queryString}` : '/profile';
    
    return await apiCall(endpoint);
  }

  /**
   * Search profile by criteria
   */
  static async searchprofile(searchCriteria: {
    name?: string;
    skills?: string[];
    location?: string;
    role?: string;
    interests?: string[];
  }): Promise<UserProfile[]> {
    const searchParams = new URLSearchParams();
    
    if (searchCriteria.name) searchParams.append('name', searchCriteria.name);
    if (searchCriteria.location) searchParams.append('location', searchCriteria.location);
    if (searchCriteria.role) searchParams.append('role', searchCriteria.role);
    
    if (searchCriteria.skills) {
      searchCriteria.skills.forEach(skill => searchParams.append('skills', skill));
    }
    
    if (searchCriteria.interests) {
      searchCriteria.interests.forEach(interest => searchParams.append('interests', interest));
    }

    const queryString = searchParams.toString();
    return await apiCall(`/profile/search?${queryString}`);
  }

  /**
   * Upload profile avatar
   */
  static async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return await apiCall('/profile/me/avatar', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type to let browser set it for FormData
    });
  }

  /**
   * Delete profile avatar
   */
  static async deleteAvatar(): Promise<void> {
    await apiCall('/profile/me/avatar', {
      method: 'DELETE'
    });
  }

  /**
   * Get profile completion percentage
   */
  static async getProfileCompletion(userId?: string): Promise<{ completionPercentage: number; missingFields: string[] }> {
    const endpoint = userId ? `/profile/${userId}/completion` : '/profile/me/completion';
    return await apiCall(endpoint);
  }

  /**
   * Add achievement to profile
   */
  static async addAchievement(achievementData: {
    title: string;
    description: string;
    date: string;
    type: string;
  }): Promise<UserProfile> {
    return await apiCall('/profile/me/achievements', {
      method: 'POST',
      body: JSON.stringify(achievementData)
    });
  }

  /**
   * Update achievement
   */
  static async updateAchievement(achievementId: string, achievementData: {
    title?: string;
    description?: string;
    date?: string;
    type?: string;
  }): Promise<UserProfile> {
    return await apiCall(`/profile/me/achievements/${achievementId}`, {
      method: 'PUT',
      body: JSON.stringify(achievementData)
    });
  }

  /**
   * Delete achievement
   */
  static async deleteAchievement(achievementId: string): Promise<UserProfile> {
    return await apiCall(`/profile/me/achievements/${achievementId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Update privacy settings
   */
  static async updatePrivacySettings(privacySettings: {
    profileVisibility?: 'public' | 'private' | 'contacts';
    showEmail?: boolean;
    showPhone?: boolean;
    showLocation?: boolean;
  }): Promise<UserProfile> {
    return await apiCall('/profile/me/privacy', {
      method: 'PUT',
      body: JSON.stringify(privacySettings)
    });
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(notificationSettings: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
  }): Promise<UserProfile> {
    return await apiCall('/profile/me/notifications', {
      method: 'PUT',
      body: JSON.stringify(notificationSettings)
    });
  }

  /**
   * Get profile by role
   */
  static async getprofileByRole(role: string, params: QueryParams = {}): Promise<PaginatedResponse<UserProfile>> {
    const searchParams = new URLSearchParams();
    searchParams.append('role', role);
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    return await apiCall(`/profile?${searchParams.toString()}`);
  }

  /**
   * Follow/unfollow a user (if social features are implemented)
   */
  static async followUser(userId: string): Promise<void> {
    await apiCall(`/profile/${userId}/follow`, {
      method: 'POST'
    });
  }

  static async unfollowUser(userId: string): Promise<void> {
    await apiCall(`/profile/${userId}/follow`, {
      method: 'DELETE'
    });
  }

  /**
   * Get user's followers
   */
  static async getFollowers(userId: string): Promise<UserProfile[]> {
    return await apiCall(`/profile/${userId}/followers`);
  }

  /**
   * Get users that the user is following
   */
  static async getFollowing(userId: string): Promise<UserProfile[]> {
    return await apiCall(`/profile/${userId}/following`);
  }
} 