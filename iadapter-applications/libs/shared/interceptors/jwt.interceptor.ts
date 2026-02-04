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
    
    if (request.url.includes('/api/v1/login') ||
      request.url.includes('/assets/') ||
      request.url.includes('.js') ||
      request.url.includes('.css') ||
      request.url.includes('.html')) {
      return next.handle(request);
    }

    const token = this.jwtTokenService.getToken();
    const tokenType = this.jwtTokenService.getTokenType();
    const hasBasicAuth = this.basicAuthService.hasBasicAuthCredentials();


    if (token && !this.jwtTokenService.isTokenExpired()) {
      request = this.addJwtTokenHeader(request, token, tokenType);
    } else if (hasBasicAuth) {
      request = this.addBasicAuthHeader(request);
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
    if (this.isRedirecting) {
      return EMPTY;
    }

    this.isRedirecting = true;

    const shouldTryBasicAuth = this.shouldTriggerBasicAuthPopup();

    if (shouldTryBasicAuth) {
      this.jwtTokenService.clearTokens();

      this.isRedirecting = false;
      return EMPTY;
    } else {
      this.jwtTokenService.clearTokens();
      this.basicAuthService.clearBasicAuthCredentials();
      
      sessionStorage.clear();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userPermissions');
      
      setTimeout(() => {
        try {
          this.router.navigate(['/login'], {
            replaceUrl: true,
            queryParams: { returnUrl: this.router.url }
          }).then(success => {
            console.log("Tried to take user to login route and failed.")
            if (!success) {
              window.location.href = '/login';
            }
            this.isRedirecting = false;
          }).catch(error => {
            console.error(error);
            window.location.href = '/login';
            this.isRedirecting = false;
          });
        } catch (error) {
          console.error(error);
          window.location.href = '/login';
          this.isRedirecting = false;
        }
      }, 0);

      return EMPTY;
    }
  }

  private shouldTriggerBasicAuthPopup(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    const userAgent = navigator.userAgent;
    const isBrowser: boolean = !!(userAgent &&
      (userAgent.includes('Mozilla') ||
        userAgent.includes('Chrome') ||
        userAgent.includes('Safari') ||
        userAgent.includes('Edge')));

    const isNotLoginPage = !window.location.pathname.includes('/login');

    const hasNoAuth = !this.jwtTokenService.getToken() && !this.basicAuthService.hasBasicAuthCredentials();

    return isBrowser && isNotLoginPage && hasNoAuth;
  }
}