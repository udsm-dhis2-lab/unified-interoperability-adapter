import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtTokenService } from '../services/jwt-token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip interceptor for login requests
    if (request.url.includes('/api/v1/login')) {
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
          return this.handle401Error(request, next);
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

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Clear tokens and redirect to login
      this.jwtTokenService.clearTokens();
      this.router.navigate(['/login']);
      this.isRefreshing = false;
      
      return throwError('Authentication required');
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addTokenHeader(request, jwt, this.jwtTokenService.getTokenType()));
        })
      );
    }
  }
}