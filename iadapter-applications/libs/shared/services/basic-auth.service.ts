import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BasicAuthCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class BasicAuthService {
  private readonly BASIC_AUTH_CREDENTIALS_KEY = 'basicAuthCredentials';

  constructor(private http: HttpClient) {}

  /**
   * Store Basic Auth credentials for use in requests
   */
  setBasicAuthCredentials(credentials: BasicAuthCredentials): void {
    const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
    sessionStorage.setItem(this.BASIC_AUTH_CREDENTIALS_KEY, encodedCredentials);
  }

  /**
   * Get stored Basic Auth credentials
   */
  getBasicAuthCredentials(): string | null {
    return sessionStorage.getItem(this.BASIC_AUTH_CREDENTIALS_KEY);
  }

  /**
   * Clear stored Basic Auth credentials
   */
  clearBasicAuthCredentials(): void {
    sessionStorage.removeItem(this.BASIC_AUTH_CREDENTIALS_KEY);
  }

  /**
   * Create HTTP headers with Basic Auth
   */
  getBasicAuthHeaders(credentials?: BasicAuthCredentials): HttpHeaders {
    let encodedCredentials: string;
    
    if (credentials) {
      encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
    } else {
      encodedCredentials = this.getBasicAuthCredentials();
      if (!encodedCredentials) {
        throw new Error('No Basic Auth credentials available');
      }
    }

    return new HttpHeaders({
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Test Basic Auth credentials by making a test request
   */
  testBasicAuthCredentials(credentials: BasicAuthCredentials, testUrl: string = '/api/v1/me'): Observable<any> {
    const headers = this.getBasicAuthHeaders(credentials);
    
    return this.http.get(testUrl, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          throw new Error('Invalid credentials');
        }
        throw error;
      })
    );
  }

  /**
   * Trigger browser Basic Auth popup by making a request that will cause 401
   * This is useful for programmatically triggering the browser's built-in auth dialog
   */
  triggerBasicAuthPopup(url: string): Observable<any> {
    // Make request without credentials to trigger 401 and browser popup
    const headers = new HttpHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    });

    return this.http.get(`${url}?basicAuth=true`, { 
      headers,
      observe: 'response',
      responseType: 'text'
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          // This is expected - the browser should show the auth popup
          return throwError(error);
        }
        return throwError(error);
      })
    );
  }

  /**
   * Check if Basic Auth credentials are available
   */
  hasBasicAuthCredentials(): boolean {
    return !!this.getBasicAuthCredentials();
  }

  /**
   * Make an authenticated request with Basic Auth
   */
  makeBasicAuthRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
    url: string, 
    credentials?: BasicAuthCredentials,
    body?: any
  ): Observable<T> {
    const headers = this.getBasicAuthHeaders(credentials);
    
    switch (method) {
      case 'GET':
        return this.http.get<T>(url, { headers });
      case 'POST':
        return this.http.post<T>(url, body, { headers });
      case 'PUT':
        return this.http.put<T>(url, body, { headers });
      case 'DELETE':
        return this.http.delete<T>(url, { headers });
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
}