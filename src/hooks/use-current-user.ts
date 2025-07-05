&ldquo;use client&rdquo;;

import { useMockAuth } from &ldquo;@/context/mock-auth-context&rdquo;;
import type { UserRole } from &ldquo;@prisma/client&rdquo;;

type Profile = {
  id: string;
  role: UserRole | null;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  completionPercentage?: number;
};

type CurrentUserData = {
  user: unknown | null;
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
        firstName: user.profile?.firstName || user.name.split(&ldquo; &rdquo;)[0],
        lastName: user.profile?.lastName || user.name.split(&ldquo; &rdquo;)[1] || &ldquo;&rdquo;,
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
