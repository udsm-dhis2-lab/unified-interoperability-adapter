import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtTokenService } from '../services/jwt-token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRedirecting = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) {}

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

    // Add JWT token to headers if available and not expired
    const token = this.jwtTokenService.getToken();
    const tokenType = this.jwtTokenService.getTokenType();

    console.log('JWT Interceptor - Token available:', !!token);
    console.log('JWT Interceptor - Token expired:', token ? this.jwtTokenService.isTokenExpired() : 'No token');

    if (token && !this.jwtTokenService.isTokenExpired()) {
      request = this.addTokenHeader(request, token, tokenType);
      console.log('JWT Interceptor - Added Authorization header');
    } else {
      console.log('JWT Interceptor - No valid token, proceeding without Authorization header');
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

  private addTokenHeader(request: HttpRequest<any>, token: string, tokenType: string | null): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `${tokenType || 'Bearer'} ${token}`
      }
    });
  }

  private handle401Error(): Observable<HttpEvent<any>> {
    // Prevent multiple simultaneous redirects
    if (this.isRedirecting) {
      console.log('JWT Interceptor - Already redirecting, skipping');
      return EMPTY;
    }
    
    this.isRedirecting = true;
    console.log('JWT Interceptor - Starting 401 error handling');
    
    // Clear tokens immediately
    this.jwtTokenService.clearTokens();
    console.log('JWT Interceptor - Cleared tokens');
    
    // Clear any cached user data
    sessionStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userPermissions');
    console.log('JWT Interceptor - Cleared cached user data');
    
    // Immediate redirect to login - no delays, no retries, no user interaction required
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
    
    // Return empty to prevent further processing
    return EMPTY;
  }
}