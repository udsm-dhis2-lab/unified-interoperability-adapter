import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Layout } from '@hdu/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, Layout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly userInfo = this.auth.userInfo;
  readonly isAuthenticated = this.auth.isAuthenticated;

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
