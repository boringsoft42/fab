import type { Municipality } from '@/types/municipality';

/**
 * Utility functions for municipality ID handling
 * Allows using username as an alternative identifier
 */

/**
 * Get municipality by username instead of ID
 */
export const getMunicipalityByUsername = async (username: string): Promise<Municipality | null> => {
    try {
        // Import the service dynamically to avoid circular dependencies
        const { MunicipalityService } = await import('@/services/municipality.service');

        // Get all municipalities and find by username
        const municipalities = await MunicipalityService.getAll();
        return municipalities.find(m => m.username === username) || null;
    } catch (error) {
        console.error('Error getting municipality by username:', error);
        return null;
    }
};

/**
 * Get municipality ID from username
 */
export const getMunicipalityIdFromUsername = async (username: string): Promise<string | null> => {
    const municipality = await getMunicipalityByUsername(username);
    return municipality?.id || null;
};

/**
 * Get municipality username from ID
 */
export const getMunicipalityUsernameFromId = async (id: string): Promise<string | null> => {
    try {
        const { MunicipalityService } = await import('@/services/municipality.service');
        const municipality = await MunicipalityService.getById(id);
        return municipality?.username || null;
    } catch (error) {
        console.error('Error getting municipality username from ID:', error);
        return null;
    }
};

/**
 * Check if a string is a username format (vs CUID format)
 */
export const isUsernameFormat = (identifier: string): boolean => {
    // Username format: lowercase, no special chars except underscore, no CUID format
    const usernamePattern = /^[a-z0-9_]+$/;
    const cuidPattern = /^c[a-z0-9]{24}$/;

    return usernamePattern.test(identifier) && !cuidPattern.test(identifier);
};

/**
 * Check if a string is a CUID format
 */
export const isCuidFormat = (identifier: string): boolean => {
    const cuidPattern = /^c[a-z0-9]{24}$/;
    return cuidPattern.test(identifier);
};

/**
 * Resolve municipality identifier (works with both ID and username)
 */
export const resolveMunicipalityIdentifier = async (identifier: string): Promise<string | null> => {
    if (isCuidFormat(identifier)) {
        // It's already an ID, return as is
        return identifier;
    } else if (isUsernameFormat(identifier)) {
        // It's a username, convert to ID
        return await getMunicipalityIdFromUsername(identifier);
    }

    // Unknown format
    return null;
}; 