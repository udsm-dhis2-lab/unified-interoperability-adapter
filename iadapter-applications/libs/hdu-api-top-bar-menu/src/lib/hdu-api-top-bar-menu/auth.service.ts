import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from './models/user.model';
import { HduHttpService } from '@iadapter-applications/hdu-api-http-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(private http: HduHttpService) {
    // Fetch the current user on service initialization
    this.fetchCurrentUser().subscribe(); // This can be modified based on your app structure
  }

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.http
      .post<User>('../../../api/v1/login', credentials)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  logout(): Observable<string> {
    return this.http.get<string>('logout');
  }

  fetchCurrentUser(): Observable<User> {
    return this.http
      .get<User>('me')
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }
}
