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
      .post<User>('../../../engine/login', credentials)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  fetchCurrentUser(): Observable<User> {
    return this.http
      .get<User>('../../../engine/me')
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }
}
