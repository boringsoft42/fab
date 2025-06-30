"use client";

import { useMockAuth } from "@/context/mock-auth-context";
import type { UserRole } from "@prisma/client";

type Profile = {
  id: string;
  role: UserRole | null;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  completionPercentage?: number;
};

type CurrentUserData = {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  refetch?: () => Promise<void>;
};

export function useCurrentUser(): CurrentUserData {
  const { user, isLoading, error } = useMockAuth();

  // Transform mock user to match expected profile structure
  const profile: Profile | null = user
    ? {
        id: user.id,
        role: user.role,
        firstName: user.profile?.firstName || user.name.split(" ")[0],
        lastName: user.profile?.lastName || user.name.split(" ")[1] || "",
        profilePicture: user.profile?.profilePicture || null,
        completionPercentage: user.profile?.completionPercentage || 0,
      }
    : null;

  const refetch = async () => {
    // Mock refetch - in real app this would refetch from API
    return Promise.resolve();
  };

  return {
    user,
    profile,
    isLoading,
    error,
    refetch,
  };
}
