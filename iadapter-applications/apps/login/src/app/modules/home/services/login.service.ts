import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { catchError, Observable } from 'rxjs';
import { LoginUrls } from '../../../shared/constants';
import {
  UnAuothorizedException,
  UnknownException,
} from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loginUrl = LoginUrls.LOGIN;

  constructor(private httpClient: HduHttpService) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.httpClient.post<any>(this.loginUrl, body).pipe(
      catchError((error: any) => {
        console.log('login error from root service', error);
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
}
