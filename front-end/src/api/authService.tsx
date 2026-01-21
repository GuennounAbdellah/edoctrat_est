import { API_BASE_URL, GOOGLE_OAUTH_ENDPOINT } from '@/config/auth';

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

// API Service for Authentication
export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store tokens in localStorage
    if (data.access) {
      localStorage.setItem('accessToken', data.access);
    }
    if (data.refresh) {
      localStorage.setItem('refreshToken', data.refresh);
    }
    
    return data;
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  },
  
  logout: async () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Optionally, call backend logout endpoint
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Redirect to login page
    window.location.href = '/login';
  },
  
  getCurrentUser: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Google OAuth login
  googleLogin: async (idToken: string) => {
    const response = await fetch(`${API_BASE_URL}${GOOGLE_OAUTH_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Google login failed');
    }
    
    const data = await response.json();
    
    // Store tokens in localStorage
    if (data.access) {
      localStorage.setItem('accessToken', data.access);
    }
    if (data.refresh) {
      localStorage.setItem('refreshToken', data.refresh);
    }
    
    return data;
  }
};