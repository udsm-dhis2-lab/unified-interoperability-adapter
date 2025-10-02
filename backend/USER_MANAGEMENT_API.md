# User Management API Documentation

This documentation covers all the user management endpoints in the unified-interoperability-adapter backend API.

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All endpoints require authentication. Include the appropriate authentication headers in your requests.

## Error Response Format
All endpoints return errors in a consistent format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Success Response Format
Most endpoints return success responses in this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

---

## User Management Endpoints

### 1. Get All Users (with Pagination)

**GET** `/users`

Returns a paginated list of users.

**Query Parameters:**
- `page` (optional, default: 0) - Page number (0-indexed)
- `size` (optional, default: 10) - Number of users per page
- `sortBy` (optional, default: "username") - Field to sort by
- `sortDirection` (optional, default: "asc") - Sort direction ("asc" or "desc")
- `search` (optional) - Search term to filter users

**Example Request:**
```
GET /api/v1/users?page=0&size=10&sortBy=username&sortDirection=asc
```

**Success Response (200):**
```json
{
  "users": [
    {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "username": "john.doe",
      "firstName": "John",
      "middleName": "William",
      "surname": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1234567890",
      "disabled": false,
      "externalAuth": false,
      "roles": [
        {
          "uuid": "role-uuid-1",
          "roleName": "USER",
          "description": "Standard user role"
        }
      ],
      "groups": [
        {
          "uuid": "group-uuid-1",
          "groupName": "Default Group",
          "description": "Default user group"
        }
      ],
      "authorities": ["READ_USER", "UPDATE_PROFILE"]
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

### 2. Create User

**POST** `/users`

Creates a new user in the system.

**Request Body:**
```json
{
  "username": "jane.doe",
  "password": "SecurePassword123",
  "firstName": "Jane",
  "middleName": "Elizabeth",
  "surname": "Doe",
  "email": "jane.doe@example.com",
  "phoneNumber": "+1234567891",
  "disabled": false,
  "externalAuth": false,
  "roles": [
    {
      "uuid": "role-uuid-1",
      "roleName": "USER",
      "description": "Standard user role"
    }
  ],
  "groups": [
    {
      "uuid": "group-uuid-1",
      "groupName": "Default Group",
      "description": "Default user group"
    }
  ]
}
```

**Required Fields:**
- `username` - Must be 3-50 characters, unique
- `password` - Must be at least 6 characters
- `firstName` - Must be 2-50 characters
- `surname` - Must be 2-50 characters

**Optional Fields:**
- `middleName` - Middle name
- `email` - Valid email address
- `phoneNumber` - Valid phone number
- `disabled` - Boolean (default: false)
- `externalAuth` - Boolean (default: false)
- `roles` - Array of role objects with UUID
- `groups` - Array of group objects with UUID

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "uuid": "new-user-uuid",
    "username": "jane.doe",
    "firstName": "Jane",
    "surname": "Doe",
    // ... other user fields
  }
}
```

**Error Responses:**
- **400 Bad Request** - Validation errors
- **409 Conflict** - Username already exists

### 3. Get User by ID

**GET** `/users/{uuid}`

Retrieves a specific user by their UUID.

**Path Parameters:**
- `uuid` - User's UUID

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "username": "john.doe",
    "firstName": "John",
    "surname": "Doe",
    // ... complete user object
  }
}
```

**Error Responses:**
- **404 Not Found** - User not found

### 4. Update User

**PUT** `/users/{uuid}`

Updates an existing user.

**Path Parameters:**
- `uuid` - User's UUID

**Request Body:**
```json
{
  "username": "john.smith",
  "firstName": "John",
  "middleName": "William",
  "surname": "Smith",
  "email": "john.smith@example.com",
  "phoneNumber": "+1234567890",
  "disabled": false,
  "roles": [
    {
      "uuid": "role-uuid-2",
      "roleName": "ADMIN",
      "description": "Administrator role"
    }
  ],
  "groups": [
    {
      "uuid": "group-uuid-2",
      "groupName": "Admin Group",
      "description": "Administrator group"
    }
  ]
}
```

**Note:** Password is optional in updates. If provided, it will be updated.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    // ... updated user object
  }
}
```

**Error Responses:**
- **400 Bad Request** - Validation errors
- **404 Not Found** - User not found
- **409 Conflict** - Username already exists

### 5. Delete User

**DELETE** `/users/{uuid}`

Soft deletes a user (marks as retired).

**Path Parameters:**
- `uuid` - User's UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- **404 Not Found** - User not found

---

## User Privileges Management

### 6. Get User Privileges

**GET** `/users/{uuid}/privileges`

Gets all privileges for a specific user (aggregated from their roles).

**Path Parameters:**
- `uuid` - User's UUID

**Success Response (200):**
```json
{
  "success": true,
  "privileges": [
    {
      "uuid": "privilege-uuid-1",
      "privilegeName": "READ_USER",
      "description": "Can read user information"
    },
    {
      "uuid": "privilege-uuid-2",
      "privilegeName": "UPDATE_PROFILE",
      "description": "Can update own profile"
    }
  ]
}
```

---

## User-Role Management

### 7. Assign Role to User

**POST** `/users/{userUuid}/roles/{roleUuid}`

Assigns a role to a user.

**Path Parameters:**
- `userUuid` - User's UUID
- `roleUuid` - Role's UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role assigned to user successfully",
  "user": {
    // ... updated user object with new role
  }
}
```

### 8. Remove Role from User

**DELETE** `/users/{userUuid}/roles/{roleUuid}`

Removes a role from a user.

**Path Parameters:**
- `userUuid` - User's UUID
- `roleUuid` - Role's UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role removed from user successfully",
  "user": {
    // ... updated user object without the role
  }
}
```

---

## User-Group Management

### 9. Assign Group to User

**POST** `/users/{userUuid}/groups/{groupUuid}`

Assigns a group to a user.

**Path Parameters:**
- `userUuid` - User's UUID
- `groupUuid` - Group's UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Group assigned to user successfully",
  "user": {
    // ... updated user object with new group
  }
}
```

### 10. Remove Group from User

**DELETE** `/users/{userUuid}/groups/{groupUuid}`

Removes a group from a user.

**Path Parameters:**
- `userUuid` - User's UUID
- `groupUuid` - Group's UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Group removed from user successfully",
  "user": {
    // ... updated user object without the group
  }
}
```

---

## Role Management Endpoints

### 11. Get All Roles

**GET** `/users/roles`

**Query Parameters:**
- `withPrivileges` (optional, default: false) - Include privileges in response

**Success Response (200):**
```json
[
  {
    "uuid": "role-uuid-1",
    "roleName": "USER",
    "description": "Standard user role",
    "privileges": [
      // ... privileges if withPrivileges=true
    ]
  }
]
```

### 12. Get Role by ID

**GET** `/users/roles/{uuid}`

**Query Parameters:**
- `withPrivileges` (optional, default: true) - Include privileges in response

### 13. Create Roles

**POST** `/users/roles`

Creates multiple roles.

**Request Body:**
```json
[
  {
    "roleName": "MANAGER",
    "description": "Manager role with elevated permissions"
  }
]
```

### 14. Update Role

**PUT** `/users/roles/{uuid}`

Updates an existing role.

---

## Privilege Management Endpoints

### 15. Get All Privileges

**GET** `/users/privileges`

### 16. Get Privilege by ID

**GET** `/users/privileges/{uuid}`

**Query Parameters:**
- `withRoles` (optional, default: true) - Include roles in response

### 17. Create Privileges

**POST** `/users/privileges`

### 18. Update Privilege

**PUT** `/users/privileges/{uuid}`

---

## Group Management Endpoints

### 19. Get All Groups

**GET** `/users/groups`

**Query Parameters:**
- `withUsers` (optional, default: false) - Include users in response

### 20. Get Group by ID

**GET** `/users/group/{uuid}`

**Query Parameters:**
- `withUsers` (optional, default: true) - Include users in response

### 21. Create Groups

**POST** `/users/groups`

---

## Authentication Endpoints

### 22. Login

**POST** `/login`

**Request Body:**
```json
{
  "username": "john.doe",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "authenticated": true,
  "uuid": "user-uuid",
  "username": "john.doe",
  "firstName": "John",
  "surname": "Doe",
  // ... other user fields
}
```

### 23. Logout

**GET** `/logout`

**Success Response (200):**
```json
{
  "loggedOut": true,
  "redirectUrl": "/"
}
```

### 24. Get Current User

**GET** `/me`

Returns information about the currently authenticated user.

---

## Data Validation Rules

### User Validation:
- **Username**: Required, 3-50 characters, unique, no special characters except dots and underscores
- **Password**: Required for creation, minimum 6 characters, should contain mix of letters, numbers, and special characters
- **First Name**: Required, 2-50 characters, letters only
- **Surname**: Required, 2-50 characters, letters only
- **Email**: Optional, valid email format
- **Phone Number**: Optional, valid international phone number format

### Role Validation:
- **Role Name**: Required, unique, 1-50 characters
- **Description**: Optional, max 255 characters

### Group Validation:
- **Group Name**: Required, unique, 1-50 characters
- **Description**: Optional, max 255 characters

### Privilege Validation:
- **Privilege Name**: Required, unique, 1-50 characters
- **Description**: Optional, max 255 characters

---

## HTTP Status Codes Used

- **200 OK** - Successful GET, PUT, DELETE operations
- **201 Created** - Successful POST operations
- **400 Bad Request** - Validation errors, malformed requests
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource (e.g., username already exists)
- **422 Unprocessable Entity** - Validation failed
- **500 Internal Server Error** - Server-side errors

---

## Sample Frontend Integration

### Angular Service Example:
```typescript
createUser(userData: CreateUserRequest): Observable<any> {
  return this.http.post(`${this.baseUrl}/users`, userData, {
    headers: { 'Content-Type': 'application/json' }
  });
}

getUsers(page: number, size: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/users?page=${page}&size=${size}`);
}
```

### Expected JSON Payload Format for User Creation:
```json
{
  "username": "testuser",
  "password": "password123",
  "firstName": "Test",
  "surname": "User",
  "email": "test@example.com",
  "phoneNumber": "+1234567890",
  "disabled": false,
  "roles": [
    {
      "uuid": "existing-role-uuid-1"
    }
  ],
  "groups": [
    {
      "uuid": "existing-group-uuid-1"
    }
  ]
}
```

This API is now fully functional with proper validation, error handling, and comprehensive CRUD operations for user management.