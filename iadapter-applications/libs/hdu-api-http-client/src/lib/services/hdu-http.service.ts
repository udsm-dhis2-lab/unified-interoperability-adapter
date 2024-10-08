import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HduHttpService {
  constructor(private httpClient: HttpClient) {}

  get<T>(
    url: string,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.get<T>(url, options);
  }

  post<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.post<T>(url, body, options);
  }

  put<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.put<T>(url, body, options);
  }

  delete<T>(
    url: string,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.delete<T>(url, options);
  }

  patch<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.patch<T>(url, body, options);
  }
}
