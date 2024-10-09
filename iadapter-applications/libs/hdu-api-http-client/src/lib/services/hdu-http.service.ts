import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HduApiHttpUrls } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class HduHttpService {
  private baseUrl: string = HduApiHttpUrls.BASE_URL;

  constructor(private httpClient: HttpClient) {}

  get<T>(
    url: string,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}${url}`, options);
  }

  post<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}${url}`, body, options);
  }

  put<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.put<T>(`${this.baseUrl}${url}`, body, options);
  }

  delete<T>(
    url: string,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseUrl}${url}`, options);
  }

  patch<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.httpClient.patch<T>(`${this.baseUrl}${url}`, body, options);
  }
}
