import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { UserInfo } from '../../models';
import { UserActivityService } from '../../services';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzTypographyModule,
    NzAvatarModule,
    NzTagModule,
    NzDropdownModule,
    NzSpaceModule,
    NzIconModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  private readonly router = inject(Router);

  private readonly userActivityService = inject(UserActivityService);

  onInit(): void {
    this.userActivityService.startIdleTimer();
  }

  isCollapsed = false;
  userInfo = input.required<UserInfo>();

  onLogout = output<void>();

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  logout(): void {
    this.onLogout.emit();
  }
}
