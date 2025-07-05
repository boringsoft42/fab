&ldquo;use client&rdquo;;

import React, { createContext, useContext, useState, useCallback } from &ldquo;react&rdquo;;
type UserRole = &ldquo;YOUTH&rdquo; | &ldquo;COMPANIES&rdquo; | &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;;

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: UserRole | null;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
    completionPercentage: number;
  } | null;
}

interface MockAuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  error: Error | null;
  signIn: (email: string, password: string, role?: UserRole) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: UserRole
  ) => Promise<void>;
  signOut: () => void;
  updateUserRole: (role: UserRole) => void;
  setUser: (user: MockUser) => void;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(
  undefined
);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signIn = useCallback(
    async (email: string, password: string, role?: UserRole) => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user data - set role immediately if provided
        const mockUser: MockUser = {
          id: &ldquo;mock-user-id&rdquo;,
          email,
          name: email.split(&ldquo;@&rdquo;)[0],
          role: role || null, // Set role immediately if provided
          profile: role
            ? {
                id: &ldquo;mock-profile-id&rdquo;,
                firstName: email.split(&ldquo;@&rdquo;)[0],
                lastName: &ldquo;&rdquo;,
                profilePicture: null,
                completionPercentage: 75,
              }
            : null,
        };

        setUserState(mockUser);

        // Store in localStorage for persistence
        localStorage.setItem(&ldquo;mockUser&rdquo;, JSON.stringify(mockUser));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(&ldquo;Sign in failed&rdquo;));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string, role?: UserRole) => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user data - set role immediately if provided
        const mockUser: MockUser = {
          id: &ldquo;mock-user-id&rdquo;,
          email,
          name,
          role: role || null, // Set role immediately if provided
          profile: role
            ? {
                id: &ldquo;mock-profile-id&rdquo;,
                firstName: name.split(&ldquo; &rdquo;)[0] || name,
                lastName: name.split(&ldquo; &rdquo;)[1] || &ldquo;&rdquo;,
                profilePicture: null,
                completionPercentage: 75,
              }
            : null,
        };

        setUserState(mockUser);

        // Store in localStorage for persistence
        localStorage.setItem(&ldquo;mockUser&rdquo;, JSON.stringify(mockUser));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(&ldquo;Sign up failed&rdquo;));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(() => {
    setUserState(null);
    localStorage.removeItem(&ldquo;mockUser&rdquo;);
  }, []);

  const updatedUser: MockUser = {
        ...user,
        role,
        profile: {
          id: &ldquo;mock-profile-id&rdquo;,
          firstName: user.name.split(&ldquo; &rdquo;)[0] || user.name,
          lastName: user.name.split(&ldquo; &rdquo;)[1] || &ldquo;&rdquo;,
          profilePicture: null,
          completionPercentage: 75,
        },
      };

      setUserState(updatedUser);
      localStorage.setItem(&ldquo;mockUser&rdquo;, JSON.stringify(updatedUser));
    },
    [user]
  );

  const setUser = useCallback((user: MockUser) => {
    setUserState(user);
    localStorage.setItem(&ldquo;mockUser&rdquo;, JSON.stringify(user));
  }, []);

  // Load user from localStorage on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem(&ldquo;mockUser&rdquo;);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
      } catch (err) {
        console.error(&ldquo;Error parsing stored user:&rdquo;, err);
        localStorage.removeItem(&ldquo;mockUser&rdquo;);
      }
    }
  }, []);

  const value: MockAuthContextType = {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateUserRole,
    setUser,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error(&ldquo;useMockAuth must be used within a MockAuthProvider&rdquo;);
  }
  return context;
}
