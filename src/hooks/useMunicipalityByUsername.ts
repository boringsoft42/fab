"use client";

import { useQuery } from '@tanstack/react-query';
import { getMunicipalityByUsername, getMunicipalityIdFromUsername } from '@/lib/utils/municipality-utils';
import { useAuthContext } from '@/hooks/use-auth';

/**
 * Hook to get municipality by username instead of ID
 */
export const useMunicipalityByUsername = (username: string) => {
    return useQuery({
        queryKey: ['municipality', 'username', username],
        queryFn: () => getMunicipalityByUsername(username),
        enabled: !!username,
    });
};

/**
 * Hook to get municipality ID from username
 */
export const useMunicipalityIdFromUsername = (username: string) => {
    return useQuery({
        queryKey: ['municipality', 'id-from-username', username],
        queryFn: () => getMunicipalityIdFromUsername(username),
        enabled: !!username,
    });
};

/**
 * Hook to get current municipality using username from auth context
 */
export const useCurrentMunicipalityByUsername = () => {
    const { user } = useAuthContext();

    // Get username from user context
    const username = user?.municipality?.username || user?.username;

    return useQuery({
        queryKey: ['municipality', 'current-by-username', username],
        queryFn: () => getMunicipalityByUsername(username || ''),
        enabled: !!username,
    });
}; 