import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: false
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Try multiple token storage keys for compatibility
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('access_token') || 
                  localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No authentication token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const { status } = error.response;
      
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // For your app, implement a proper token refresh if needed
          // For now, just redirect to login
          console.log('Authentication expired. Redirecting to login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('access_token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('access_token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // Add specific error handling for different status codes
      switch (status) {
        case 403: {
          console.error('Access denied. You do not have permission to access this resource.');
          console.error('Please check if you are logged in and have a valid authentication token.');
          error.friendlyMessage = "Accès refusé. Veuillez vous connecter pour accéder à cette ressource.";
          // Check if token exists
          const token = localStorage.getItem('accessToken') || 
                        localStorage.getItem('access_token') || 
                        localStorage.getItem('token');
          if (!token) {
            console.error('No authentication token found. Redirecting to login...');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          }
          break;
        }
        case 404:
          error.friendlyMessage = "La ressource demandée n'existe pas.";
          break;
        case 500:
          error.friendlyMessage = "Une erreur serveur s'est produite. Veuillez réessayer plus tard.";
          break;
        default:
          error.friendlyMessage = "Une erreur s'est produite. Veuillez réessayer.";
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      error.friendlyMessage = "Pas de réponse du serveur. Veuillez vérifier votre connexion internet.";
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request', error.message);
      error.friendlyMessage = "Erreur lors de la préparation de la requête.";
    }
    
    return Promise.reject(error);
  }
);

//url: Export API methods
//config: optional axios config like headers etc.
//data: request body for POST and PUT requests
export const api = {
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  patch: (url, data, config) => instance.patch(url, data, config),
  delete: (url, config) => instance.delete(url, config)
};

// Alias for backward compatibility
export const apiClient = instance;
export default instance;