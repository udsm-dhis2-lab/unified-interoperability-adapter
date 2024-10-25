import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Fetch the current user on service initialization
    this.fetchCurrentUser().subscribe(); // This can be modified based on your app structure
  }

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.http
      .post<User>('../../../api/v1/hduApi/login', credentials)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  fetchCurrentUser(): Observable<User> {
    return this.http
      .get<User>('../../../api/v1/hduApi/me')
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }
}
