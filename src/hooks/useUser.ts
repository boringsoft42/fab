/**
 * useUser Hook
 *
 * Custom hook to fetch and manage current user data including:
 * - Supabase Auth user
 * - User rol (admin_fab, admin_asociacion, atleta, entrenador, juez)
 * - User estado (pendiente, activo, inactivo, rechazado)
 * - Associated asociacion data
 *
 * Requirements implemented:
 * - REQ-2.3.1: Include estado field in returned data
 * - REQ-1.2.1: Support 5 roles
 * - REQ-1.3.1: Support 4 estados
 *
 * Usage:
 * ```tsx
 * const { user, userRecord, asociacion, isLoading, error } = useUser();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!user) return <LoginPrompt />;
 * if (userRecord?.estado === 'pendiente') return <PendingBanner />;
 * ```
 */

'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type UserRole = 'admin_fab' | 'admin_asociacion' | 'atleta' | 'entrenador' | 'juez';
export type UserEstado = 'pendiente' | 'activo' | 'inactivo' | 'rechazado';

export interface UserRecord {
  user_id: string;
  rol: UserRole;
  estado: UserEstado;
  asociacion_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Asociacion {
  id: string;
  nombre: string;
  departamento: string;
  ciudad: string | null;
  contacto: string | null;
  email: string | null;
  telefono: string | null;
  estado: boolean;
}

export interface UseUserReturn {
  // Supabase Auth user
  user: User | null;

  // User record from database
  userRecord: UserRecord | null;

  // Associated asociacion
  asociacion: Asociacion | null;

  // Loading state
  isLoading: boolean;

  // Error state
  error: Error | null;

  // Refetch function
  refetch: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  const [asociacion, setAsociacion] = useState<Asociacion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Get auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!authUser) {
        setUser(null);
        setUserRecord(null);
        setAsociacion(null);
        setIsLoading(false);
        return;
      }

      setUser(authUser);

      // 2. Get user record from database
      const { data: userRecordData, error: userRecordError } = await supabase
        .from('users')
        .select('user_id, rol, estado, asociacion_id, created_at, updated_at')
        .eq('user_id', authUser.id)
        .single();

      if (userRecordError) {
        throw new Error(`Failed to fetch user record: ${userRecordError.message}`);
      }

      if (!userRecordData) {
        throw new Error('User record not found in database');
      }

      setUserRecord(userRecordData as UserRecord);

      // 3. Get asociacion data
      const { data: asociacionData, error: asociacionError } = await supabase
        .from('asociaciones')
        .select('id, nombre, departamento, ciudad, contacto, email, telefono, estado')
        .eq('id', userRecordData.asociacion_id)
        .single();

      if (asociacionError) {
        console.error('Failed to fetch asociacion:', asociacionError);
        // Don't throw - asociacion is optional
      } else {
        setAsociacion(asociacionData as Asociacion);
      }

    } catch (err) {
      console.error('Error in useUser:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUserData();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserData();
      } else {
        setUser(null);
        setUserRecord(null);
        setAsociacion(null);
        setIsLoading(false);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    userRecord,
    asociacion,
    isLoading,
    error,
    refetch: fetchUserData,
  };
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user, isLoading } = useUser();
  return !isLoading && user !== null;
}

/**
 * Hook to check if user has active estado
 */
export function useIsActive(): boolean {
  const { userRecord, isLoading } = useUser();
  return !isLoading && userRecord?.estado === 'activo';
}

/**
 * Hook to check if user is pending approval
 */
export function useIsPending(): boolean {
  const { userRecord, isLoading } = useUser();
  return !isLoading && userRecord?.estado === 'pendiente';
}

/**
 * Hook to get user's role
 */
export function useUserRole(): UserRole | null {
  const { userRecord, isLoading } = useUser();
  return isLoading ? null : userRecord?.rol ?? null;
}
