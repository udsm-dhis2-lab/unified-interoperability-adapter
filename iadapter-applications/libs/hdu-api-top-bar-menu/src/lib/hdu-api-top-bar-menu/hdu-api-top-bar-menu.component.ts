import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TZNationalEmblemIcon } from './resources/national-emblem.icon';
import { SideMenuService } from './services/menu/side-menu.service';
import { User } from './models/user.model';
import { AuthService } from './auth.service';
import { getInitials } from './helpers/user.helper';

@Component({
  selector: 'lib-hdu-api-top-bar-menu',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzPageHeaderModule,
  ],
  templateUrl: './hdu-api-top-bar-menu.component.html',
  styleUrl: './hdu-api-top-bar-menu.component.less',
})
export class HduApiTopBarMenuComponent implements OnInit {
  currentUser: User | null = null;
  currentUserInitials = '';
  selectedSideMenuName = '';

  constructor(
    private sideMenuService: SideMenuService,
    private authService: AuthService
  ) {}

  applicationIcon = 'assets/images/logo.png';

  ngOnInit(): void {
    this.applicationIcon = TZNationalEmblemIcon;
    this.selectedSideMenuName = this.sideMenuService.getMenuNameByRoute();

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user && user.name) {
        this.currentUserInitials = getInitials(user.name)
      }
    });
  }
}
