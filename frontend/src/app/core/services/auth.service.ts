import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, lastValueFrom, map, mergeMap, of, tap, throwError } from 'rxjs';
import { API_URLS } from '../../shared';
import { UserInfo } from '../models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  error?: string;
  success?: boolean;
  cacheKey: string = "privileges"
  cachedPrivileges: string[] = [];

  constructor(
    private http?: HttpClient,
    private router?: Router
  ) {

  }

  logout() {
    this.clearUserData();
    localStorage.setItem("latest_route", this.router!.url);
    this.router!.navigate(['/login']);
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
      map(async (response: any) => {
        if (this.success) {
          this.saveUserData(response)
          await lastValueFrom(this.get_user())
        }
        return response
      }),
      catchError((error: any) => {
        console.log("Error: ", error)
        return throwError(() => error);
      })
    )
  }


  refresh_token(): Observable<any> {
    const refresh_token = localStorage.getItem("refresh_token")!

    const headers = new HttpHeaders({
      'refresh-token': refresh_token
    });

    return this.http!.post(
      `${API_URLS.REFRESH_TOKEN}`, null, { headers }
    )
  }

  get_user(): Observable<any> {
    return this.http!.get(`${API_URLS.GET_USER}`).pipe(
      mergeMap((response: any) => {
        localStorage.setItem("current_user", JSON.stringify(response))
        return of(response)
      }),
      catchError((error: any) => {
        return of(error)
      })
    )
  }

  userInfo(): UserInfo | null {
    let user = JSON.parse(localStorage.getItem("current_user") || "{}");
    return {
      email: user?.email,
      role: user?.roles[0]?.roleName,
      name: user?.username
    }
  }

  saveUserData(response: any) {
    this.clearUserData()

    localStorage.setItem("access_token", response?.accessToken)
    localStorage.setItem("refresh_token", response?.refreshToken)

    const expiry_timestamp_string = this.calculateExpiryTime(response?.accessTokenExpiry);

    const refresh_timestamp_string = this.calculateExpiryTime(response?.refreshTokenExpiry);

    localStorage.setItem("access_token_expiry", expiry_timestamp_string);
    localStorage.setItem("refresh_token_expiry", refresh_timestamp_string);
  }

  private autoLogout(seconds: number) {
    setTimeout(() => {
      this.logout()
    }, seconds * 1000)
  }

  private autoRefresh(seconds: number) {
    setTimeout(async () => {
      const response = await lastValueFrom(this.refresh_token())
      this.saveUserData(response)
    }, (seconds - 30) * 1000)
  }

  isAuthenticated(): boolean {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const access_token_expiry = localStorage.getItem("access_token_expiry");
    const refresh_token_expiry = localStorage.getItem("refresh_token_expiry");

    if (!access_token || !refresh_token || !access_token_expiry || !refresh_token_expiry) {
      return false;
    }

    const now = new Date().getTime() / 1000;

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

  private calculateExpiryTime(seconds: string) {

    const now = new Date().getTime() / 1000;
    let expiry_timestamp_array = (now + Number(seconds)).toString()?.split(".");

    expiry_timestamp_array[1] = expiry_timestamp_array[1]?.length === 2 ? expiry_timestamp_array[1] + "0" : expiry_timestamp_array[1]?.length === 1 ? expiry_timestamp_array[1] + "00" : expiry_timestamp_array[1];

    return expiry_timestamp_array.join(".");
  }
}