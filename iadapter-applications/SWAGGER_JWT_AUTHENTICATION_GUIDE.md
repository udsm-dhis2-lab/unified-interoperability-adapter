# Swagger JWT Authentication Guide

## 🎯 **JWT Authentication Now Fully Integrated with Swagger UI!**

Your Swagger documentation now has complete JWT authentication support with a global "Authorize" button that authenticates all endpoints automatically.

### 🔧 **How to Use JWT Authentication in Swagger**

#### **Step 1: Access Swagger UI**
Open your browser and navigate to:
```
http://localhost:8091/swagger-ui/index.html
```

#### **Step 2: Notice the Authentication Features**
You'll see:
- 🔒 **"Authorize" button** at the top right of the Swagger UI
- **Comprehensive API documentation** with authentication requirements clearly marked
- **Login endpoint** clearly documented without authentication requirements
- **Protected endpoints** marked with a lock icon (🔒)

#### **Step 3: Get Your JWT Token**
1. **Expand the "User Management" section**
2. **Find the `POST /api/v1/login` endpoint**
3. **Click "Try it out"**
4. **Enter the credentials**:
   ```json
   {
     "username": "admin",
     "password": "password123"
   }
   ```
5. **Click "Execute"**
6. **Copy the token from the response** (the long string after `"token":`)

#### **Step 4: Authenticate All Endpoints**
1. **Click the 🔒 "Authorize" button** at the top of the page
2. **Paste your JWT token** in the "Value" field (don't include "Bearer ")
3. **Click "Authorize"**
4. **Click "Close"**

#### **Step 5: Test Protected Endpoints**
Now all API requests will automatically include your JWT token! You can:
- ✅ **Create users** via `POST /api/v1/users`
- ✅ **Get all users** via `GET /api/v1/users`
- ✅ **Get current user info** via `GET /api/v1/me`
- ✅ **Test any other protected endpoint**

### 🎉 **What's New in Swagger**

#### **Enhanced Documentation**
- **Clear authentication instructions** in the API description
- **Detailed endpoint descriptions** with authentication requirements
- **Response examples** for success and error cases
- **Default admin credentials** provided in the documentation

#### **JWT Security Schema**
- **Bearer token authentication** properly configured
- **JWT format** specified in the security schema
- **Global authentication** applies to all protected endpoints
- **Login endpoint** correctly excluded from authentication requirements

#### **User Experience Improvements**
- **One-click authentication** for all endpoints
- **Visual indicators** showing which endpoints require authentication
- **Clear error responses** with proper HTTP status codes
- **Comprehensive API descriptions**

### 📋 **Available Endpoints**

#### **🔓 Public Endpoints (No Authentication Required)**
- `POST /api/v1/login` - Get JWT token

#### **🔒 Protected Endpoints (JWT Required)**
- `GET /api/v1/users` - Get all users (paginated)
- `POST /api/v1/users` - Create new user
- `GET /api/v1/me` - Get current user info
- `GET /api/v1/users/{uuid}` - Get specific user
- `PUT /api/v1/users/{uuid}` - Update user
- `DELETE /api/v1/users/{uuid}` - Delete user
- And many more...

### 🧪 **Test Scenarios You Can Try**

#### **Scenario 1: Basic Authentication Flow**
1. Login to get token
2. Create a new user
3. List all users to see your new user

#### **Scenario 2: User Management**
1. Get current user info
2. Update user details
3. Assign roles to users

#### **Scenario 3: Error Handling**
1. Try accessing protected endpoint without token (should get 401)
2. Try with invalid token (should get 401)
3. Try with expired token (should get 401)

### 🔐 **Default Credentials**

```
Username: admin
Password: password123
```

### 🎯 **Example JWT Token Structure**
Your JWT tokens contain:
```json
{
  "sub": "admin",
  "iat": 1758879550,
  "exp": 1758965950,
  "authorities": ["ALL"]
}
```

### 🚨 **Important Notes**

#### **Token Expiration**
- Tokens expire after 24 hours by default
- You'll need to login again to get a new token
- Expired tokens will return 401 Unauthorized

#### **Security**
- The login endpoint doesn't require authentication (by design)
- All other endpoints require a valid JWT token
- Tokens are validated on every request

#### **Troubleshooting**
- If you get 401 errors, check that you've clicked "Authorize" and entered a valid token
- Make sure to copy the complete token without extra spaces
- Don't include "Bearer " prefix when pasting the token

### 🎊 **Success Indicators**

You'll know the authentication is working when:
- ✅ The 🔒 "Authorize" button shows "Logout" after authentication
- ✅ Protected endpoints show unlocked icons
- ✅ All API requests return 200/201 instead of 401
- ✅ You can create users and access protected resources

### 📚 **Additional Resources**

- **API Documentation**: Available in Swagger UI with detailed descriptions
- **JWT Token Testing**: Use the test scripts provided in the project
- **cURL Examples**: Available in `CURL_TESTING_GUIDE.md`
- **Complete Test Suite**: Run `complete-user-creation-test.sh`

---

## 🎉 **Ready to Explore!**

Your Swagger UI is now fully configured with JWT authentication. Visit:
**http://localhost:8091/swagger-ui/index.html**

Happy testing! 🚀