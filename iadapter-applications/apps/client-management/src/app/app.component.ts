import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import { HduApiTopBarMenuComponent } from 'libs/hdu-api-top-bar-menu/src/lib/hdu-api-top-bar-menu/hdu-api-top-bar-menu.component';
import { HduApiNavMenuComponent } from 'libs/hdu-api-nav-menu/src/lib/hdu-api-nav-menu/hdu-api-nav-menu.component';
import { antDesignModules } from './shared/ant-design.modules';
import { Menu } from './shared/models/menu.model';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CoreModule,
    HduApiTopBarMenuComponent,
    HduApiNavMenuComponent,
    ...antDesignModules,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'client-management';
  menus: Menu[] = [
    {
      name: 'Client Management',
      routeUrl: '/',
      icon: 'user',
      category: 'main',
      subMenus: [
        {
          name: 'Clients',
          routeUrl: '/',
          icon: 'unordered-list',
          subMenus: [],
        },
        {
          name: 'Deduplication',
          routeUrl: '/deduplication',
          icon: 'merge',
          subMenus: [],
        },
      ],
    },
    {
      name: 'Worflow Management',
      routeUrl: '/worflowManbagement',
      icon: 'apartment',
      category: 'main',
      subMenus: [
        {
          name: 'workflows',
          routeUrl: '/',
          icon: 'unordered-list',
          subMenus: [],
        },
      ],
    },
  ];

  isCollapsed = false;
  handleCollapseChange() {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(private router: Router) {}

  onGetSelectedMenu(menu: Menu): void {
    !menu?.category || (menu?.category && menu?.category !== 'main')
      ? this.router.navigate([menu.routeUrl])
      : window.open('../../..' + menu.routeUrl, '_self');
  }
}
