import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, lastValueFrom, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { API_URLS } from '../../shared';
import { UserInfo } from '../models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  error?: string;
  cacheKey: string = "privileges"
  cachedPrivileges: string[] = [];

  constructor(
    private http?: HttpClient,
    private router?: Router
  ) {

  }

  logout(shouldLogoutFromServer: boolean = true) {
    if (shouldLogoutFromServer) {
      this.http!.post(`${API_URLS.LOGOUT}`, {}, { withCredentials: true }).pipe(
        tap(() => {
          this.router!.navigate(['/login']);
        }),
        catchError((error: any) => {
          console.log("Error during logout: ", error);
          this.router!.navigate(['/login']);
          return throwError(() => error);
        })
      ).subscribe();
    } else {
      this.router!.navigate(['/login']);
    }
    this.clearUserData();
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = {
      username: username,
      password: password
    };
    return this.http!.post(`${API_URLS.LOGIN}`, body, { headers: headers, withCredentials: true }).pipe(
      switchMap((response: any) => {
        this.saveAuthData(response);
        return this.get_user().pipe(
          map(() => response)
        );
      }),
      catchError((error: any) => {
        console.log("Error: ", error);
        return throwError(() => error);
      })
    )
  }


  refresh_token(): Observable<any> {
    const refresh_token = localStorage.getItem("refresh_token")!

    return this.http!.post(
      `${API_URLS.REFRESH_TOKEN}`, { refreshToken: refresh_token }
    ).pipe(
      tap((response) => {
        this.saveAuthData(response)
      }),
      catchError((error) => throwError(() => error) )
    )
  }

  get_user(): Observable<any> {
    return this.http!.get(`${API_URLS.GET_USER}`).pipe(
      mergeMap((response: any) => {
        localStorage.setItem("current_user", JSON.stringify(response))
        return of(response)
      }),
      catchError((error: any) => throwError(() => error))
    )
  }

  userInfo(): UserInfo | null {
    let user = JSON.parse(localStorage.getItem("current_user") || "{}");
    return {
      email: user?.email,
      role: user?.roles?.[0]?.roleName,
      name: user?.username
    }
  }

  saveAuthData(response: any) {
    this.clearAuthData()

    localStorage.setItem("access_token", response?.accessToken);
    localStorage.setItem("refresh_token", response?.refreshToken);

    localStorage.setItem("access_token_expiry", new Date(response?.accessTokenExpiry).getTime().toString());
    localStorage.setItem("refresh_token_expiry", new Date(response?.refreshTokenExpiry).getTime().toString());
  }

  autoRefresh = (seconds: number) => {
    setTimeout(async () => {
      const response = await lastValueFrom(this.refresh_token())
      this.saveAuthData(response)
    }, (seconds - 30) * 1000)
  }

  isAuthenticated = (): boolean => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const access_token_expiry = localStorage.getItem("access_token_expiry");
    const refresh_token_expiry = localStorage.getItem("refresh_token_expiry");

    if (!access_token || !refresh_token || !access_token_expiry || !refresh_token_expiry) {
      return false;
    }

    const now = new Date().getTime();

    if (now > Number(refresh_token_expiry)) {
      this.logout();
      return false;
    }

    if (now > Number(access_token_expiry)) {
      this.autoRefresh(30);
      return true;
    }
    return true;
  }

  clearUserData() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token_expiry");
    localStorage.removeItem("refresh_token_expiry")
    localStorage.removeItem("current_user");
  }

  clearAuthData() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token_expiry");
    localStorage.removeItem("refresh_token_expiry");
  }
}