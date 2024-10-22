import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { icons } from './ant-design-icons.constants';
import { antDesignModules } from './ant-design.modules';
import { Menu } from './models/menu.model';

@Component({
  selector: 'lib-hdu-api-nav-menu',
  standalone: true,
  imports: [CommonModule, ...antDesignModules],
  templateUrl: './hdu-api-nav-menu.component.html',
  styleUrl: './hdu-api-nav-menu.component.less',
  providers: [{ provide: NZ_ICONS, useValue: icons }],
})
export class HduApiNavMenuComponent {
  menus: Menu[] = [
    {
      name: 'Dashboard',
      routeUrl: '/dashboard',
      icon: 'apartment',
      category: 'main',
    },
    {
      name: 'Client Management',
      routeUrl: '/client-management',
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
      routeUrl: '/worflow-management',
      icon: 'apartment',
      category: 'main',
      subMenus: [
        {
          name: 'Workflows',
          routeUrl: '/workflows',
          icon: 'calendar',
          subMenus: [],
        },
        {
          name: 'Schedules',
          routeUrl: '/schedules',
          icon: 'unordered-list',
          subMenus: [],
        },
      ],
    },
    {
      name: 'Mapping and Data Extraction',
      routeUrl: '/mapping-and-data-extraction',
      icon: 'apartment',
      category: 'main',
      subMenus: [
        {
          name: 'Datasets',
          routeUrl: '',
          icon: 'unordered-list',
          subMenus: [],
        },
        {
          name: 'Settings',
          routeUrl: '/settings',
          icon: 'unordered-list',
          subMenus: [],
        },
      ],
    },
  ];

  @Output() selectedMenu: EventEmitter<Menu> = new EventEmitter<Menu>();

  constructor() { }

  onRouteTo(event: Event, menu: Menu): void {
    event.stopPropagation();
    this.selectedMenu.emit(menu);
  }
}
