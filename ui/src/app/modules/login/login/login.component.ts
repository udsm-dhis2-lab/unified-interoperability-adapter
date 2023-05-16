import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
  authenticatingUser$: Observable<boolean> | undefined;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onLogin(event: Event): void {
    event.stopPropagation();
    const creadentials = { username: this.username, password: this.password };
    this.router.navigate(['/dashboard']);
  }
}
