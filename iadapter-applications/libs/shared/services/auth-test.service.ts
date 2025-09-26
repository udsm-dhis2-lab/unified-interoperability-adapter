import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtTokenService } from './jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthTestService {
  private readonly baseUrl = '/api/v1';

  constructor(
    private http: HttpClient,
    private jwtTokenService: JwtTokenService
  ) {}

  /**
   * Test endpoint that should trigger 401 if not authenticated
   */
  testAuthenticatedEndpoint(): Observable<any> {
    console.log('AuthTestService - Making test request to /api/v1/me');
    return this.http.get(`${this.baseUrl}/me`);
  }

  /**
   * Simulate login with a fake token for testing
   */
  simulateLogin(): void {
    const fakeToken = 'fake-jwt-token-for-testing';
    this.jwtTokenService.setToken(fakeToken);
    this.jwtTokenService.setTokenType('Bearer');
    console.log('AuthTestService - Set fake token for testing:', fakeToken);
  }

  /**
   * Clear all authentication data
   */
  logout(): void {
    this.jwtTokenService.clearTokens();
    console.log('AuthTestService - Cleared all tokens');
  }

  /**
   * Check current authentication status
   */
  checkAuthStatus(): void {
    const token = this.jwtTokenService.getToken();
    const isAuthenticated = this.jwtTokenService.isAuthenticated();
    const isExpired = token ? this.jwtTokenService.isTokenExpired() : null;
    
    console.log('AuthTestService - Current auth status:', {
      hasToken: !!token,
      token: token?.substring(0, 20) + '...' || 'None',
      isAuthenticated,
      isExpired
    });
  }
}