# JWT Authentication with curl - Testing Guide

## Current System Status

✅ **JWT Authentication is Working!**
- No more browser basic auth pop-ups
- Proper JSON 401 responses
- JWT interceptor functioning correctly
- Stateless authentication implemented

## Issue Identified

The admin user password setup in `UserInitializer.java` has an encoding issue. The password "AdminUser" is being double-encoded or there's a mismatch in the encoding process.

## Solution: Fix Admin User Password

### Step 1: Temporary Fix for Testing

Update the UserInitializer to use a known password. Modify `../backend/src/main/java/com/Adapter/icare/Initializer/UserInitializer.java`:

```java
// Change line 58 from:
userCreate.setPassword("AdminUser");

// To:
userCreate.setPassword("password123");
```

Then restart the backend server.

### Step 2: Alternative - Direct Database Fix

If you have database access, you can manually update the admin password:

```sql
-- Generate BCrypt hash for 'password123' and update
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE username = 'admin';
```

## Testing JWT Authentication with curl

### 1. Test Authentication (Login)

```bash
# Login to get JWT token
curl -X POST http://localhost:8091/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin", 
    "password": "password123"
  }' | jq .
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "username": "admin",
    "firstName": "Admin",
    "middleName": "HDU",
    "surname": "API",
    // ... other user fields
  },
  "authenticated": true
}
```

### 2. Save Token for Subsequent Requests

```bash
# Extract and save the token
TOKEN=$(curl -X POST http://localhost:8091/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin", 
    "password": "password123"
  }' | jq -r '.token')

echo "Token: $TOKEN"
```

### 3. Create a New User

```bash
# Create new user using JWT token
curl -X POST http://localhost:8091/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "newuser",
    "password": "newpassword123",
    "firstName": "John",
    "middleName": "A",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "disabled": false,
    "externalAuth": false
  }' | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "uuid": "generated-uuid",
    "username": "newuser",
    "firstName": "John",
    "middleName": "A",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "disabled": false,
    "externalAuth": false,
    // ... other fields
  }
}
```

### 4. Test Authentication with New User

```bash
# Login with newly created user
curl -X POST http://localhost:8091/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser", 
    "password": "newpassword123"
  }' | jq .
```

### 5. Test Protected Endpoints

```bash
# Get all users (requires authentication)
curl -X GET http://localhost:8091/api/v1/users \
  -H "Authorization: Bearer $TOKEN" | jq .

# Get current user info
curl -X GET http://localhost:8091/api/v1/me \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## Testing JWT Error Handling

### 1. Test 401 Response (No Token)

```bash
# Should return JSON 401, not browser popup
curl -X GET http://localhost:8091/api/v1/users \
  -H "Content-Type: application/json" | jq .
```

**Expected Response:**
```json
{
  "authenticated": false,
  "error": "Unauthorized",
  "message": "Access denied. Please log in to continue.",
  "path": "/api/v1/users"
}
```

### 2. Test Invalid Token

```bash
# Should return JSON 401
curl -X GET http://localhost:8091/api/v1/users \
  -H "Authorization: Bearer invalid-token" | jq .
```

### 3. Test Expired Token

```bash
# Use an old/expired token - should return JSON 401
curl -X GET http://localhost:8091/api/v1/users \
  -H "Authorization: Bearer expired-token-here" | jq .
```

## Complete User Creation Script

```bash
#!/bin/bash

# JWT User Creation Script
API_BASE="http://localhost:8091/api/v1"

echo "🔐 Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST $API_BASE/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin", 
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed - check admin password"
  exit 1
fi

echo "✅ Login successful! Token: ${TOKEN:0:20}..."

echo "👤 Creating new user..."
USER_RESPONSE=$(curl -s -X POST $API_BASE/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "testuser001",
    "password": "TestPassword123!",
    "firstName": "Test",
    "middleName": "API",
    "surname": "User",
    "email": "testuser001@example.com",
    "phoneNumber": "+1234567890",
    "disabled": false,
    "externalAuth": false
  }')

echo "User Creation Response: $USER_RESPONSE"

echo "🔍 Testing new user login..."
NEW_USER_LOGIN=$(curl -s -X POST $API_BASE/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser001", 
    "password": "TestPassword123!"
  }')

echo "New User Login Response: $NEW_USER_LOGIN"

NEW_TOKEN=$(echo $NEW_USER_LOGIN | jq -r '.token')
if [ "$NEW_TOKEN" != "null" ] && [ ! -z "$NEW_TOKEN" ]; then
  echo "✅ New user authentication successful!"
  
  echo "📋 Fetching user list with new user token..."
  curl -s -X GET $API_BASE/users \
    -H "Authorization: Bearer $NEW_TOKEN" | jq '.users[].username'
else
  echo "❌ New user authentication failed"
fi
```

## Verification Checklist

- [ ] No browser basic auth popups appear
- [ ] 401 responses return JSON format
- [ ] JWT tokens are generated on successful login
- [ ] JWT tokens are validated on protected endpoints
- [ ] User creation works with valid JWT
- [ ] New users can authenticate and get their own JWT
- [ ] Invalid/expired tokens are properly rejected

## Troubleshooting

### Common Issues:

1. **"Authentication failed: Invalid password"**
   - Fix admin password in UserInitializer.java
   - Restart backend server
   - Clear database and let initializer recreate admin user

2. **CORS errors in browser**
   - CORS configuration is already implemented
   - Check if requests include proper Content-Type headers

3. **Token not being sent**
   - Ensure Authorization header format: `Authorization: Bearer <token>`
   - Verify token is not null or undefined

### Debug Commands:

```bash
# Check if backend is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:8091/api/v1/users

# Test CORS
curl -X OPTIONS http://localhost:8091/api/v1/login \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -v
```