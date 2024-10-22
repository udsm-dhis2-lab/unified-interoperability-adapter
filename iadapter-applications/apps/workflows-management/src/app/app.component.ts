import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { antDesignModules } from './shared/config/ant-design.modules';
import { HduApiTopBarMenuComponent } from 'libs/hdu-api-top-bar-menu/src/lib/hdu-api-top-bar-menu/hdu-api-top-bar-menu.component';
import { HduApiNavMenuComponent } from 'libs/hdu-api-nav-menu/src/lib/hdu-api-nav-menu/hdu-api-nav-menu.component';
import { Menu } from './shared/models/menu.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    CommonModule,
    HduApiTopBarMenuComponent,
    HduApiNavMenuComponent,
    ...antDesignModules,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'workflows-management';

  isCollapsed = false;

  handleCollapseChange() {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(private router: Router) {}

  onMenuItemClick(menu: Menu): void {
    if (menu?.category === 'main') {
      // window.open('../../..' + menu.routeUrl, '_self');
    } else {
      this.router.navigate(['/' + menu.routeUrl]);
    }
  }
}
