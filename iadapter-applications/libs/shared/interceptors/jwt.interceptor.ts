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
    // Skip interceptor for login requests and static assets
    if (request.url.includes('/api/v1/login') || 
        request.url.includes('/assets/') ||
        request.url.includes('.js') ||
        request.url.includes('.css') ||
        request.url.includes('.html')) {
      return next.handle(request);
    }

    // Add JWT token to headers if available and not expired
    const token = this.jwtTokenService.getToken();
    const tokenType = this.jwtTokenService.getTokenType();

    if (token && !this.jwtTokenService.isTokenExpired()) {
      request = this.addTokenHeader(request, token, tokenType);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
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
      return EMPTY;
    }
    
    this.isRedirecting = true;
    
    // Clear tokens immediately
    this.jwtTokenService.clearTokens();
    
    // Clear any cached user data
    sessionStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userPermissions');
    
    // Immediate redirect to login - no delays, no retries, no user interaction required
    console.warn('401 Unauthorized detected - redirecting to login immediately');
    
    // Use setTimeout to avoid navigation during HTTP request
    setTimeout(() => {
      // Force navigation to login with replace to prevent back navigation
      window.location.href = '/login';
      this.isRedirecting = false;
    }, 0);
    
    // Return empty to prevent further processing
    return EMPTY;
  }
}