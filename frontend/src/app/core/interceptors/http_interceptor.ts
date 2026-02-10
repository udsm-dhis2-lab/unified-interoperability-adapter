import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, map, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../services";
import { API_URLS } from "@hdu/shared";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private authService: AuthService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.addAuthToken(request)).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && !request.url.includes(`${API_URLS.REFRESH_TOKEN}`)) {
                    return this.handle401Error(request, next);
                }
                return throwError(() => error);
            }),
            map((response: any) => {
                return response;
            })
        );
    }

    private addAuthToken(request: HttpRequest<any>): HttpRequest<any> {
        const token = localStorage.getItem('access_token');
        if (token) {
            return request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }
        return request;
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refresh_token().pipe(
                switchMap((response) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(response.access_token);
                    return next.handle(this.addAuthToken(request));
                }),
                catchError((error) => {
                    this.isRefreshing = false;
                    this.authService.logout();
                    return throwError(() => error);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addAuthToken(request));
                })
            );
        }
    }
}
