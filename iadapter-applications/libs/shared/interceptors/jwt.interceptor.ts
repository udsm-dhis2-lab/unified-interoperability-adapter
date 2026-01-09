import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtTokenService } from '../services/jwt-token.service';
import { BasicAuthService } from '../services/basic-auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRedirecting = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private jwtTokenService: JwtTokenService,
    private basicAuthService: BasicAuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('JWT Interceptor - Processing request:', request.url);

    // Skip interceptor for login requests and static assets
    if (request.url.includes('/api/v1/login') ||
      request.url.includes('/assets/') ||
      request.url.includes('.js') ||
      request.url.includes('.css') ||
      request.url.includes('.html')) {
      console.log('JWT Interceptor - Skipping request:', request.url);
      return next.handle(request);
    }

    // Try to add authentication headers in order of preference:
    // 1. JWT token (if available and not expired)
    // 2. Basic Auth credentials (if available)
    // 3. No authentication header

    const token = this.jwtTokenService.getToken();
    const tokenType = this.jwtTokenService.getTokenType();
    const hasBasicAuth = this.basicAuthService.hasBasicAuthCredentials();

    console.log('JWT Interceptor - Token available:', !!token);
    console.log('JWT Interceptor - Token expired:', token ? this.jwtTokenService.isTokenExpired() : 'No token');
    console.log('JWT Interceptor - Basic Auth available:', hasBasicAuth);

    if (token && !this.jwtTokenService.isTokenExpired()) {
      // Use JWT token (highest priority)
      request = this.addJwtTokenHeader(request, token, tokenType);
      console.log('JWT Interceptor - Added JWT Authorization header');
    } else if (hasBasicAuth) {
      // Fallback to Basic Auth if JWT is not available/expired
      request = this.addBasicAuthHeader(request);
      console.log('JWT Interceptor - Added Basic Auth Authorization header');
    } else {
      console.log('JWT Interceptor - No authentication credentials available');
    }

    return next.handle(request).pipe(
      catchError(error => {
        console.log('JWT Interceptor - Caught error:', error.status, error.message);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.warn('JWT Interceptor - 401 Unauthorized detected, handling...');
          return this.handle401Error();
        }
        return throwError(error);
      })
    );
  }

  private addJwtTokenHeader(request: HttpRequest<any>, token: string, tokenType: string | null): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `${tokenType || 'Bearer'} ${token}`
      }
    });
  }

  private addBasicAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    try {
      const basicAuthCredentials = this.basicAuthService.getBasicAuthCredentials();
      if (basicAuthCredentials) {
        return request.clone({
          setHeaders: {
            'Authorization': `Basic ${basicAuthCredentials}`
          }
        });
      }
    } catch (error) {
      console.warn('JWT Interceptor - Failed to add Basic Auth header:', error);
    }
    return request;
  }

  private handle401Error(): Observable<HttpEvent<any>> {
    // Prevent multiple simultaneous redirects
    if (this.isRedirecting) {
      console.log('JWT Interceptor - Already redirecting, skipping');
      return EMPTY;
    }

    this.isRedirecting = true;
    console.log('JWT Interceptor - Starting 401 error handling');

    // Check if we should try Basic Auth popup before redirecting to login
    const shouldTryBasicAuth = this.shouldTriggerBasicAuthPopup();

    if (shouldTryBasicAuth) {
      console.log('JWT Interceptor - Browser environment detected, allowing Basic Auth popup');

      // Clear only JWT tokens, but keep Basic Auth credentials
      this.jwtTokenService.clearTokens();

      // Don't redirect immediately - let the browser handle the Basic Auth popup
      // The DualAuthenticationEntryPoint will trigger the popup
      this.isRedirecting = false;
      return EMPTY;
    } else {
      // Standard JWT error handling - clear everything and redirect
      this.jwtTokenService.clearTokens();
      this.basicAuthService.clearBasicAuthCredentials();
      console.log('JWT Interceptor - Cleared all authentication credentials');

      // Clear any cached user data
      sessionStorage.clear();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userPermissions');
      console.log('JWT Interceptor - Cleared cached user data');

      // Immediate redirect to login
      console.warn('JWT Interceptor - 401 Unauthorized detected - redirecting to login immediately');

      // Use setTimeout to avoid navigation during HTTP request
      setTimeout(() => {
        try {
          // Try Angular router first
          console.log('JWT Interceptor - Attempting Angular router navigation to /login');
          this.router.navigate(['/login'], {
            replaceUrl: true,
            queryParams: { returnUrl: this.router.url }
          }).then(success => {
            if (success) {
              console.log('JWT Interceptor - Angular router navigation successful');
            } else {
              console.warn('JWT Interceptor - Angular router navigation failed, using window.location');
              window.location.href = '/login';
            }
            this.isRedirecting = false;
          }).catch(error => {
            console.error('JWT Interceptor - Angular router navigation error:', error);
            console.log('JWT Interceptor - Falling back to window.location');
            window.location.href = '/login';
            this.isRedirecting = false;
          });
        } catch (error) {
          console.error('JWT Interceptor - Error during navigation:', error);
          console.log('JWT Interceptor - Using window.location as fallback');
          window.location.href = '/login';
          this.isRedirecting = false;
        }
      }, 0);

      return EMPTY;
    }
  }

  private shouldTriggerBasicAuthPopup(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    // Check user agent to see if it's a browser that supports Basic Auth popup
    const userAgent = navigator.userAgent;
    const isBrowser: boolean = !!(userAgent &&
      (userAgent.includes('Mozilla') ||
        userAgent.includes('Chrome') ||
        userAgent.includes('Safari') ||
        userAgent.includes('Edge')));

    // Check if the current page is not already the login page
    const isNotLoginPage = !window.location.pathname.includes('/login');

    // Check if there are no existing auth credentials (to avoid infinite popups)
    const hasNoAuth = !this.jwtTokenService.getToken() && !this.basicAuthService.hasBasicAuthCredentials();

    return isBrowser && isNotLoginPage && hasNoAuth;
  }
}