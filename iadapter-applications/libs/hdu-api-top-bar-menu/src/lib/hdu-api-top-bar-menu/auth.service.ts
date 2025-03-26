import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HduHttpService } from '../../../../hdu-api-http-client/src/index';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(private hduHttpService: HduHttpService) {
    // Fetch the current user on service initialization
    this.fetchCurrentUser().subscribe(); // This can be modified based on your app structure
  }

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.hduHttpService
      .post<User>('login', credentials)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  logout(): Observable<string> {
    return this.hduHttpService.get<string>('logout');
  }

  fetchCurrentUser(): Observable<User> {
    return this.hduHttpService
      .get<User>('me')
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }
}
