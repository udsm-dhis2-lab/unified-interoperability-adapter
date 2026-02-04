import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HduHttpService } from '@iadapter-applications/hdu-api-http-client';
import { User } from './models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(private hduHttpService: HduHttpService, private router: Router) {
    // Fetch the current user on service initialization
    // this.fetchCurrentUser().subscribe(); // This can be modified based on your app structure
  }

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.hduHttpService
      .post<User>('login', credentials)
      .pipe(tap((user: User) => this.currentUserSubject.next(user)));
  }

  logout(): Observable<unknown> {
    return this.hduHttpService.get<unknown>('logout').pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        // window.location.href = '/login';
        this.router.navigate(['/login'])
      })
    );
  }

  fetchCurrentUser(): Observable<User> {
    return this.hduHttpService
      .get<User>('me')
      .pipe(tap((user: User) => this.currentUserSubject.next(user)));
  }
}
