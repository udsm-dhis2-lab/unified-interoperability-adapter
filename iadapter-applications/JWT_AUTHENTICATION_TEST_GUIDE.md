# JWT Authentication Implementation - Testing Guide

## Summary of Changes

This document outlines the complete JWT authentication refactoring that replaces the previous basic authentication system.

### Backend Changes (Spring Boot)

1. **Dependencies Added**
   - Added JJWT libraries to `pom.xml` for JWT token generation and validation

2. **New Components**
   - `JwtTokenProvider.java`: Generates, validates, and extracts information from JWT tokens
   - `JwtAuthenticationFilter.java`: Filters incoming requests to validate JWT tokens
   - `JwtAuthenticationEntryPoint.java`: Returns JSON 401 responses instead of browser dialogs
   - `JwtAuthenticationResponse.java`: DTO for JWT login responses

3. **Updated Components**
   - `SecurityConfigurations.java`: Configured for stateless JWT authentication
   - `UserController.java`: Login endpoint now returns JWT tokens

### Frontend Changes (Angular)

1. **New Services**
   - `JwtTokenService`: Manages JWT token storage, validation, and headers
   - `JwtInterceptor`: Automatically adds Authorization headers and handles 401 responses
   - `AuthGuard`: Protects routes and redirects unauthenticated users

2. **Updated Components**
   - `LoginService`: Stores JWT tokens on successful authentication
   - `LoginComponent`: Handles return URLs and JWT-based authentication flow
   - App routing: All protected routes now use AuthGuard

## Testing Steps

### 1. Start the Backend
```bash
cd ../backend
mvn spring-boot:run
```

### 2. Start the Frontend
```bash
cd iadapter-applications
npm run serve:apps
```

### 3. Test Authentication Flow

#### Test Case 1: Login without Valid Token
1. Navigate to `http://localhost:4200/dashboard` (or any protected route)
2. **Expected**: Should redirect to `/login` with returnUrl parameter
3. **Verify**: Check browser dev tools for no basic auth dialog

#### Test Case 2: Successful Login
1. Go to login page
2. Enter valid credentials
3. **Expected**: 
   - Successful login message
   - Redirect to intended route (dashboard or returnUrl)
   - JWT token stored in localStorage
   - User data stored in localStorage

#### Test Case 3: Authenticated Requests
1. After successful login, navigate to any protected route
2. **Expected**: 
   - Route loads without redirect
   - Check Network tab: All API requests should have `Authorization: Bearer <token>` header

#### Test Case 4: Token Expiration/Invalid Token
1. Manually corrupt the token in localStorage or wait for expiration
2. Make an API request (refresh page or navigate)
3. **Expected**: 
   - 401 response with JSON error (not browser dialog)
   - Automatic redirect to login page
   - Tokens cleared from localStorage

#### Test Case 5: Logout Flow
1. Implement a logout button that calls `loginService.logout()`
2. **Expected**: 
   - Tokens cleared from localStorage
   - Redirect to login page

## Configuration Notes

### JWT Token Configuration
- Default expiration: 24 hours (configurable via `app.jwt.expiration`)
- Secret key: Default "mySecretKey" (should be changed via `app.jwt.secret`)
- Token format: `Bearer <jwt_token>`

### Security Features Implemented
- Stateless authentication (no server sessions)
- Automatic token validation on each request
- Secure token storage in localStorage
- Route protection with automatic redirects
- JSON error responses (no browser dialogs)
- CORS compatibility maintained

### API Response Format
**Successful Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "username": "user",
    "firstName": "First",
    "lastName": "Last",
    // ... other user fields
  },
  "authenticated": true
}
```

**401 Unauthorized Response:**
```json
{
  "authenticated": false,
  "error": "Unauthorized",
  "message": "Access denied. Please log in to continue.",
  "path": "/api/v1/some-endpoint"
}
```

## Production Considerations

1. **Change JWT Secret**: Set a strong, unique secret via environment variable
2. **Token Expiration**: Adjust based on security requirements
3. **HTTPS Only**: Ensure all production traffic uses HTTPS
4. **Refresh Tokens**: Consider implementing refresh token mechanism for longer sessions
5. **Rate Limiting**: Add rate limiting to login endpoint
6. **Monitoring**: Log authentication attempts and failures

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS configuration includes Authorization header
2. **Token Not Sent**: Check interceptor registration in app.config.ts
3. **Infinite Redirects**: Verify auth guard logic and login route configuration
4. **Token Parsing Errors**: Ensure JWT secret matches between client expectations and server

### Debug Steps
1. Check browser localStorage for tokens
2. Monitor Network tab for Authorization headers
3. Check backend logs for JWT validation errors
4. Verify interceptor is registered and firing
5. Confirm auth guard is properly protecting routes