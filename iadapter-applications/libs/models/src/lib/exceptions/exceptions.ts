export class UnAuothorizedException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InternalServerException extends Error {
  constructor(message: string) {
    super(message);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/login'], {
            queryParams: { sessionExpired: true },
          });
        }
        return throwError(error);
      })
    );
  }
}
