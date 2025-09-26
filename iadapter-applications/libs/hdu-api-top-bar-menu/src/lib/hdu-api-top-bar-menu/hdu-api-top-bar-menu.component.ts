import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TZNationalEmblemIcon } from './resources/national-emblem.icon';
import { SideMenuService } from './services/menu/side-menu.service';
import { AuthService } from './auth.service';
import { getInitials } from './helpers/user.helper';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { User } from './models/user.model';

@Component({
  selector: 'lib-hdu-api-top-bar-menu',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzPageHeaderModule,
    NzDropDownModule,
  ],
  templateUrl: './hdu-api-top-bar-menu.component.html',
  styleUrl: './hdu-api-top-bar-menu.component.less',
})
export class HduApiTopBarMenuComponent implements OnInit {
  @Input() appName: string | null = null;
  currentUser: User | null = null;
  currentUserInitials = '';
  selectedSideMenuName = '';

  constructor(
    private sideMenuService: SideMenuService,
    private authService: AuthService,
    private router: Router
  ) {}

  applicationIcon = 'assets/images/logo.png';

  ngOnInit(): void {
    this.applicationIcon = TZNationalEmblemIcon;
    this.selectedSideMenuName = this.sideMenuService.getMenuNameByRoute();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.currentUserInitials = getInitials(
          `${user.firstName} ${user.lastName}`
        );
      } else {
        this.currentUserInitials = getInitials('AA');
      }
    });
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  logOut() {
    this.authService.logout().subscribe({
      next: () => {
        // Clear any stored tokens/data
        localStorage.clear();
        sessionStorage.clear();
        // Redirect to login
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout API fails, clear local data and redirect
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      },
    });
  }
}
