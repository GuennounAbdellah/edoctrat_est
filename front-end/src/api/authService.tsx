import { API_BASE_URL } from '@/config/auth';

// Utility function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't parse the token, assume it's invalid/expired
  }
};

// Utility function to refresh access token
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.warn('No refresh token available');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access) {
        localStorage.setItem('accessToken', data.access);
        return data.access;
      } else {
        console.error('Refresh token response missing access token');
        return null;
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Token refresh failed:', response.status, errorData);
      
      // If refresh fails, clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return null;
  }
};

// Utility function to get auth headers with automatic token refresh
const getAuthHeaders = async () => {
  let token = localStorage.getItem('accessToken');

  // Check if token exists and is expired
  if (token && isTokenExpired(token)) {
    token = await refreshAccessToken();
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// API Service for Directeur CED
export const directeurCedApi = {
  // Get candidates for CED
  getCedCandidats: async (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/get-ced-candidats/${queryString ? '?' + queryString : ''}`;
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Get subjects for CED
  getCedSujets: async (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/get-ced-sujets/${queryString ? '?' + queryString : ''}`;
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Get results for CED
  getCedResultats: async (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/get-ced-resultats/${queryString ? '?' + queryString : ''}`;
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Get all inscriptions
  getAllInscriptions: async (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/get-ced-inscriptions/${queryString ? '?' + queryString : ''}`;
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Download registration report
  downloadRegistrationReport: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/download-registration-report`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }
};