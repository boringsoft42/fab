"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/hooks/use-auth";
import { UserRole, User } from "@/types/api";
import { mapBackendRoleToFrontend } from "@/lib/utils";

type Profile = {
  id: string;
  role: UserRole | null;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  completionPercentage?: number;
  primaryColor?: string;
  secondaryColor?: string;
  company?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
};

type CurrentUserData = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  refetch?: () => Promise<void>;
};

export function useCurrentUser(): CurrentUserData {
  const { user, loading } = useAuthContext();

  console.log('🔍 useCurrentUser: Auth state:', {
    user: !!user,
    loading,
    userId: user?.id,
    userRole: user?.role,
    userType: typeof user?.role
  });

  // Log when user changes
  useEffect(() => {
    console.log('🔍 useCurrentUser: User changed:', {
      user: !!user,
      userId: user?.id,
      userRole: user?.role,
      userType: typeof user?.role
    });
  }, [user]);



  // Transform real user to match expected profile structure
  const profile: Profile | null = user
    ? {
      id: user.id,
      role: (mapBackendRoleToFrontend(user.role) as UserRole) || null,
      firstName: user.firstName || user.username || '',
      lastName: user.lastName || '',
      profilePicture: user.profilePicture || null,
      completionPercentage: 0,
      primaryColor: user.primaryColor,
      secondaryColor: user.secondaryColor,
      // Include company information if available
      ...(user.company && {
        company: {
          id: user.company.id,
          name: user.company.name,
          email: user.company.email,
          phone: user.company.phone,
        }
      }),
    }
    : null;

  console.log('🔍 useCurrentUser: Profile:', profile);
  console.log('🔍 useCurrentUser: Raw user data:', {
    id: user?.id,
    role: user?.role,
    firstName: user?.firstName,
    lastName: user?.lastName,
    username: user?.username,
    profilePicture: user?.profilePicture
  });

  const refetch = async () => {
    // In real app this would refetch from API
    // For now, just return a resolved promise
    return Promise.resolve();
  };

  return {
    user: user,
    profile,
    isLoading: loading,
    error: null, // No error handling for now
    refetch,
  };
}
