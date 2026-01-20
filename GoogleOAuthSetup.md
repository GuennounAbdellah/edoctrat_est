# Google OAuth Setup and Troubleshooting Guide

## Problem Description
The Google Sign-In was failing with two main issues:
1. **Cross-Origin-Opener-Policy (COOP) error**: Occurs when `window.postMessage` is blocked
2. **401 Unauthorized error**: The Google token validation was failing due to user role restrictions

## Root Cause
The main issue was that users attempting Google OAuth login did not exist in the system or did not have the proper roles assigned. Google OAuth is restricted to users with the following roles:
- professeur
- directeur_ced
- directeur_labo
- directeur_pole

Users with the "candidat" role cannot use Google OAuth and must use email/password authentication.

## Solutions Implemented

### 1. Enhanced Error Logging
- Improved GoogleOAuthService to provide more detailed error messages
- Added information about which groups a user belongs to when authentication fails

### 2. Frontend Improvements
- Added `'X-Requested-With': 'XMLHttpRequest'` header to Google OAuth requests
- This helps the backend properly identify the request type

### 3. New API Endpoints for User Management

#### Create Professeur User
```bash
curl -X POST http://localhost:8000/api/createProfesseur \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password",
    "firstName": "Your",
    "lastName": "Name"
  }'
```

#### Create Directeur CED User
```bash
curl -X POST http://localhost:8000/api/createDirecteurCed \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

#### Debug User Roles
```bash
curl -X GET http://localhost:8000/api/debug-user/your-email@example.com
```

## Steps to Fix Your Current Issue

1. **Check if your user exists and has proper roles**:
   ```bash
   curl -X GET http://localhost:8000/api/debug-user/yassine.chatbi@usmba.ac.ma
   ```

2. **If the user doesn't exist, create a professeur account**:
   ```bash
   curl -X POST http://localhost:8000/api/createProfesseur \
     -H "Content-Type: application/json" \
     -d '{
       "email": "yassine.chatbi@usmba.ac.ma",
       "password": "securePassword123",
       "firstName": "Yassine",
       "lastName": "Chatbi"
     }'
   ```

3. **Alternatively, create a directeur account**:
   ```bash
   curl -X POST http://localhost:8000/api/createDirecteurCed \
     -H "Content-Type: application/json" \
     -d '{
       "email": "yassine.chatbi@usmba.ac.ma",
       "password": "securePassword123"
     }'
   ```

4. **Verify the user has proper roles**:
   ```bash
   curl -X GET http://localhost:8000/api/debug-user/yassine.chatbi@usmba.ac.ma
   ```

5. **Now try Google Sign-In again** - it should work!

## Important Notes

- Only users with roles `professeur`, `directeur_ced`, `directeur_labo`, or `directeur_pole` can use Google OAuth
- Users with the `candidat` role must use email/password authentication
- The Google OAuth client ID must be properly configured in both frontend and backend
- Make sure your Google OAuth credentials allow your domain (http://localhost:5173 by default)

## Testing Your Setup

After creating a user with proper roles, you can test the Google OAuth flow:
1. Navigate to the login page
2. Click the Google Sign-In button
3. Select your Google account
4. You should be successfully authenticated

## Troubleshooting

If you still encounter issues:
1. Check the application logs for detailed error messages
2. Ensure your Google client ID is properly configured
3. Verify that your Google OAuth consent screen is properly set up
4. Confirm that your origin (http://localhost:5173) is whitelisted in Google Cloud Console