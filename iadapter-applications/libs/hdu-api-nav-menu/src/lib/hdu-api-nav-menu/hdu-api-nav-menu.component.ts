import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { icons } from './ant-design-icons.constants';
import { antDesignModules } from './ant-design.modules';
import { Menu } from './models/menu.model';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'lib-hdu-api-nav-menu',
  standalone: true,
  imports: [CommonModule, ...antDesignModules],
  templateUrl: './hdu-api-nav-menu.component.html',
  styleUrl: './hdu-api-nav-menu.component.less',
  providers: [{ provide: NZ_ICONS, useValue: icons }],
})
export class HduApiNavMenuComponent implements OnInit {
  @Input() activeMainMenuId: string | null = null;
  currentUser: User | null = null;
  menus: Menu[] = [
    {
      name: 'Dashboard',
      id: 'dashboard',
      routeUrl: '/dashboard',
      icon: 'apartment',
      category: 'main',
    },
    {
      name: 'Client Management',
      id: 'client-management',
      routeUrl: '/client-management',
      icon: 'user',
      category: 'main',
      subMenus: [
        {
          name: 'Clients',
          id: 'clients',
          routeUrl: '/',
          icon: 'unordered-list',
          subMenus: [],
        },
        {
          id: 'deduplication',
          name: 'Deduplication',
          routeUrl: '/deduplication',
          icon: 'merge',
          subMenus: [],
        },
      ],
    },
    {
      name: 'Worflow Management',
      id: 'workflow-management',
      routeUrl: '/worflow-management',
      icon: 'apartment',
      category: 'main',
      subMenus: [
        {
          name: 'Workflows',
          id: 'workflows',
          routeUrl: '/workflows',
          icon: 'calendar',
          subMenus: [],
        },
        {
          id: 'schedules',
          name: 'Schedules',
          routeUrl: '/schedules',
          icon: 'unordered-list',
          subMenus: [],
        },
      ],
    },
    {
      id: 'mapping-and-data-extraction',
      name: 'Mapping and Data Extraction',
      routeUrl: '/mapping-and-data-extraction',
      icon: 'apartment',
      category: 'main',
      subMenus: [
        {
          name: 'Datasets',
          id: 'datasets',
          routeUrl: '',
          icon: 'unordered-list',
          subMenus: [],
        },
        {
          name: 'Settings',
          id: 'settings',
          routeUrl: '/settings',
          icon: 'unordered-list',
          subMenus: [],
        },
      ],
    },
  ];

  @Output() selectedMenu: EventEmitter<Menu> = new EventEmitter<Menu>();

  constructor(private authService: AuthService) {
    this.activeMainMenuId = !this.activeMainMenuId
      ? 'dashboard'
      : this.activeMainMenuId;
  }

  ngOnInit(): void {}

  onRouteTo(event: Event, menu: Menu): void {
    event.stopPropagation();
    this.selectedMenu.emit(menu);
  }
}
