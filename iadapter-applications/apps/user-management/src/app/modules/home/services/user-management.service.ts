import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User, Role, Privilege, Group } from '../models';

export interface UserPage {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateUserRequest {
  username: string;
  firstName: string;
  middleName?: string;
  surname: string;
  email?: string;
  phoneNumber?: string;
  disabled?: boolean;
  password?: string;
  roles?: string[];
  privileges?: string[];
  groups?: string[];
}

export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  disabled?: boolean;
  roles?: string[];
  privileges?: string[];
  groups?: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly baseUrl = '/api/v1';

  constructor(private httpClient: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('UserManagementService error:', error);
    return throwError(() => error);
  }

  // User CRUD operations - matching the exact API endpoints
  
  /**
   * GET /api/v1/users - Get all users with pagination
   */
  getUsers(page?: number, pageSize?: number): Observable<User[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (pageSize !== undefined) params = params.set('size', pageSize.toString());

    return this.httpClient.get<User[]>(`${this.baseUrl}/users`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/users/{uuid} - Get specific user by ID
   */
  getUserById(uuid: string): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/${uuid}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST /api/v1/users - Create new user
   */
  createUser(user: CreateUserRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.baseUrl}/users`, user)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT /api/v1/users/{uuid} - Update existing user
   */
  updateUser(uuid: string, user: UpdateUserRequest): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}/users/${uuid}`, user)
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE /api/v1/users/{uuid} - Delete user (This endpoint might need to be added to backend)
   */
  deleteUser(uuid: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/users/${uuid}`)
      .pipe(catchError(this.handleError));
  }

  // Role management - matching exact API endpoints
  
  /**
   * GET /api/v1/users/roles/{uuid} - Get user roles
   */
  getUserRoles(uuid: string): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.baseUrl}/users/roles/${uuid}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT /api/v1/users/roles/{uuid} - Update user roles
   */
  updateUserRoles(uuid: string, roles: string[]): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/users/roles/${uuid}`, { roles })
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/users/roles - Get all roles
   */
  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.baseUrl}/users/roles`)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST /api/v1/users/roles - Create new role
   */
  createRole(role: { roleName: string; description?: string }): Observable<Role> {
    return this.httpClient.post<Role>(`${this.baseUrl}/users/roles`, role)
      .pipe(catchError(this.handleError));
  }

  // Privilege management - matching exact API endpoints
  
  /**
   * GET /api/v1/users/privileges/{uuid} - Get user privileges
   */
  getUserPrivileges(uuid: string): Observable<Privilege[]> {
    return this.httpClient.get<Privilege[]>(`${this.baseUrl}/users/privileges/${uuid}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT /api/v1/user/privileges/{uuid} - Update user privileges
   */
  updateUserPrivileges(uuid: string, privileges: string[]): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/user/privileges/${uuid}`, { privileges })
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/users/privileges - Get all privileges
   */
  getAllPrivileges(): Observable<Privilege[]> {
    return this.httpClient.get<Privilege[]>(`${this.baseUrl}/users/privileges`)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST /api/v1/users/privileges - Create new privilege
   */
  createPrivilege(privilege: { name: string; description?: string }): Observable<Privilege> {
    return this.httpClient.post<Privilege>(`${this.baseUrl}/users/privileges`, privilege)
      .pipe(catchError(this.handleError));
  }

  // Group management - matching exact API endpoints
  
  /**
   * GET /api/v1/users/group/{uuid} - Get user group
   */
  getUserGroups(uuid: string): Observable<Group[]> {
    return this.httpClient.get<Group[]>(`${this.baseUrl}/users/group/${uuid}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/users/groups - Get all groups
   */
  getAllGroups(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(`${this.baseUrl}/users/groups`)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST /api/v1/users/groups - Create new group
   */
  createGroup(group: { name: string; description?: string }): Observable<Group> {
    return this.httpClient.post<Group>(`${this.baseUrl}/users/groups`, group)
      .pipe(catchError(this.handleError));
  }

  // Authentication - matching exact API endpoints
  
  /**
   * POST /api/v1/login - User authentication
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/logout - User logout
   */
  logout(): Observable<void> {
    return this.httpClient.get<void>(`${this.baseUrl}/logout`)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/me - Get current user profile
   */
  getCurrentUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/me`)
      .pipe(catchError(this.handleError));
  }
}
