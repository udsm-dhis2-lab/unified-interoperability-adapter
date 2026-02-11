import { Component, inject } from '@angular/core';
import { Layout } from '../layout/layout';
import { SessionWarningModalComponent } from '../dialogs/session-warning-modal/session-warning.modal';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-main-page',
  imports: [Layout, SessionWarningModalComponent, RouterModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly userInfo = this.auth.userInfo;

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
