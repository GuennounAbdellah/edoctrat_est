import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  exp: number;
  iat: number;
  authorities?: string[];
  roles?: string[];
  groups?: string[];
  [key: string]: any;
}

/**
 * Get user role from JWT token
 * @param token - JWT access token
 * @returns user role or null if not found
 */
export const getUserRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    let roles: string[] = [];

    // Try different possible locations for roles in JWT
    if (decoded.roles && Array.isArray(decoded.roles)) {
      roles = decoded.roles;
    } else if (decoded.authorities && Array.isArray(decoded.authorities)) {
      roles = decoded.authorities.map((auth: string) => auth.replace('ROLE_', '').toLowerCase());
    } else if (decoded.groups && Array.isArray(decoded.groups)) {
      roles = decoded.groups;
    } else {
      // Fallback to checking other possible fields
      if (decoded.userRole) {
        roles = [decoded.userRole];
      } else if (decoded.role) {
        roles = [decoded.role];
      }
    }

    // Return primary role or default to candidat
    return roles.length > 0 ? roles[0].toLowerCase() : 'candidat';
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param token - JWT access token
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

/**
 * Get expiration time from token
 * @param token - JWT access token
 * @returns expiration timestamp or null if invalid
 */
export const getTokenExpiration = (token: string | null): number | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get all user roles from token
 * @param token - JWT access token
 * @returns array of user roles
 */
export const getUserRolesFromToken = (token: string | null): string[] => {
  if (!token) return [];

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    let roles: string[] = [];

    // Try different possible locations for roles in JWT
    if (decoded.roles && Array.isArray(decoded.roles)) {
      roles = decoded.roles.map(role => role.toLowerCase());
    } else if (decoded.authorities && Array.isArray(decoded.authorities)) {
      roles = decoded.authorities.map((auth: string) => auth.replace('ROLE_', '').toLowerCase());
    } else if (decoded.groups && Array.isArray(decoded.groups)) {
      roles = decoded.groups.map(group => group.toLowerCase());
    } else {
      // Fallback to checking other possible fields
      if (decoded.userRole) {
        roles = [decoded.userRole.toLowerCase()];
      } else if (decoded.role) {
        roles = [decoded.role.toLowerCase()];
      }
    }

    return roles;
  } catch (error) {
    console.error('Error decoding token:', error);
    return [];
  }
};

/**
 * Check if user has a specific role or higher privileged role
 * Directeur roles (ced, labo, pole) also have professeur privileges
 * @param token - JWT access token
 * @param roleToCheck - role to check for
 * @returns boolean indicating if user has the role
 */
export const hasRole = (token: string | null, roleToCheck: string): boolean => {
  if (!token) return false;

  const userRoles = getUserRolesFromToken(token);
  
  // Normalize the role to check
  const normalizedRole = roleToCheck.toLowerCase();
  
  // Check if user has the exact role
  if (userRoles.includes(normalizedRole)) {
    return true;
  }
  
  // Define role hierarchy - directeur roles also have professeur privileges
  const directeurRoles = ['directeur_ced', 'directeur_labo', 'directeur_pole'];
  
  // If checking for professeur role, also check for directeur roles
  if (normalizedRole === 'professeur') {
    return userRoles.some(role => 
      role === 'professeur' || directeurRoles.includes(role)
    );
  }
  
  // For other roles, check exact match
  return userRoles.includes(normalizedRole);
};

/**
 * Get the highest privilege role for the user
 * @param token - JWT access token
 * @returns highest privilege role
 */
export const getHighestRole = (token: string | null): string => {
  if (!token) return 'candidat';

  const userRoles = getUserRolesFromToken(token);
  
  // Define role hierarchy from highest to lowest
  const roleHierarchy = [
    'admin',
    'directeur_ced',
    'directeur_labo',
    'directeur_pole',
    'professeur',
    'scolarite',
    'candidat'
  ];
  
  // Find the highest role the user has
  for (const role of roleHierarchy) {
    if (userRoles.includes(role)) {
      return role;
    }
  }
  
  // Check for directeur roles that also grant professeur privileges
  for (const directeurRole of ['directeur_ced', 'directeur_labo', 'directeur_pole']) {
    if (userRoles.includes(directeurRole)) {
      return directeurRole;
    }
  }
  
  return 'candidat';
};