import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  iat: number;
  authorities?: string[];
  roles?: string[];
  groups?: string[];
  [key: string]: any;
}

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');

  // Check if token exists and is valid
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(accessToken);

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role permissions if specified
    if (allowedRoles && allowedRoles.length > 0) {
      // Extract roles from the token - different backends may store roles differently
      let userRoles: string[] = [];
      
      // Try different possible locations for roles in JWT
      if (decodedToken.roles && Array.isArray(decodedToken.roles)) {
        userRoles = decodedToken.roles;
      } else if (decodedToken.authorities && Array.isArray(decodedToken.authorities)) {
        userRoles = decodedToken.authorities.map((auth: string) => auth.replace('ROLE_', '').toLowerCase());
      } else if (decodedToken.groups && Array.isArray(decodedToken.groups)) {
        userRoles = decodedToken.groups;
      } else {
        // Fallback: try to extract from other possible fields
        userRoles = ['candidat']; // default fallback
      }

      // Convert to lowercase for comparison
      userRoles = userRoles.map(role => role.toLowerCase());

      // Check if user has any of the allowed roles
      const hasPermission = allowedRoles.some(role => userRoles.includes(role.toLowerCase()));
      
      if (!hasPermission) {
        // Redirect to appropriate dashboard based on user's actual role
        if (userRoles.includes('directeur_ced')) {
          return <Navigate to="/ced-dashboard" replace />;
        } else if (userRoles.includes('directeur_labo')) {
          return <Navigate to="/labo-dashboard" replace />;
        } else if (userRoles.includes('scolarite')) {
          return <Navigate to="/scolarite-dashboard" replace />;
        } else if (userRoles.includes('professeur') || userRoles.includes('directeur_pole') || userRoles.includes('directeur_ced') || userRoles.includes('directeur_labo')) {
          return <Navigate to="/professeur-dashboard" replace />;
        } else if (userRoles.includes('directeur_pole')) {
          return <Navigate to="/pole-dashboard" replace />;
        } else {
          return <Navigate to="/candidat-dashboard" replace />;
        }
      }
    }

    // User is authenticated and authorized
    return children;
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;