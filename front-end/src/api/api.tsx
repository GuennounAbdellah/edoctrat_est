import { API_BASE_URL } from '@/config/auth';

// Utility function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
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
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
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
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
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
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
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
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Download registration report
  downloadRegistrationReport: async () => {
    const response = await fetch(`${API_BASE_URL}/api/download-registration-report`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }
};