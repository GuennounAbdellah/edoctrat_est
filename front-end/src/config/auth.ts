// Configuration d'authentification
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Google OAuth2 Client ID (à configurer)
// Obtenez-le depuis : https://console.cloud.google.com/apis/credentials
// Créez un fichier .env avec VITE_GOOGLE_CLIENT_ID=votre-client-id
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Endpoint for unified login
export const UNIFIED_LOGIN_ENDPOINT = '/api/token/';

// Endpoint for unified Google OAuth
export const GOOGLE_OAUTH_ENDPOINT = '/api/verify-is-prof/';

// Registration endpoint
export const REGISTER_CANDIDAT_ENDPOINT = '/api/register/candidat/';

// Email verification endpoints
export const VERIFY_EMAIL_ENDPOINT = '/api/verify-email/';
export const RESEND_VERIFICATION_ENDPOINT = '/api/resend-verification/';

// Password reset endpoints
export const REQUEST_PASSWORD_RESET_ENDPOINT = '/api/request-password-reset/';
export const PERFORM_PASSWORD_RESET_ENDPOINT = '/api/perform-password-reset/';
