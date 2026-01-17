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

    return roles.length > 0 ? roles[0].toLowerCase() : 'candidat'; // default to candidat
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