import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/authentication/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string | undefined;
  password: string | undefined;
  error$: Observable<any> | undefined;
  hide: boolean = true;
  authenticating: boolean = false;
  authenticatingUser$: Observable<any> | undefined;
  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {}

  onLogin(event: Event): void {
    event.stopPropagation();
    this.authenticating = true;
    const creadentials = { username: this.username, password: this.password };
    this.authenticatingUser$ = this.loginService.login(creadentials);
    this.authenticatingUser$.subscribe((response: any) => {
      console.log('response', response);
      if (response && response?.authenticated) {
        this.authenticating = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 100);
      }
    });
  }
}
