import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { JwtTokenService } from 'libs/shared/services/jwt-token.service';
import { catchError, Observable, tap } from 'rxjs';
import { LoginUrls } from '../../../shared/constants';
import { UnAuothorizedException, UnknownException } from 'libs/models';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loginUrl = LoginUrls.LOGIN;

  constructor(
    private httpClient: HduHttpService,
    private jwtTokenService: JwtTokenService
  ) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.httpClient.post<any>(this.loginUrl, body).pipe(
      tap((response: any) => {
        if (response.authenticated && response.token) {
          // Store JWT token and user information
          this.jwtTokenService.setToken(response.token);
          this.jwtTokenService.setTokenType(response.tokenType || 'Bearer');
          this.jwtTokenService.setUser(response.user);
        }
      }),
      catchError((error: any) => {
        if (error.status === 401) {
          throw new UnAuothorizedException('Invalid username or password');
        } else {
          throw new UnknownException(
            'An unexpected error occurred. Please try again later.'
          );
        }
      })
    );
  }

  logout(): void {
    this.jwtTokenService.clearTokens();
  }

  isAuthenticated(): boolean {
    return this.jwtTokenService.isAuthenticated();
  }

  getCurrentUser(): any | null {
    return this.jwtTokenService.getUser();
  }
}
