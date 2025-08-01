import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { icons } from './ant-design-icons.constants';
import { antDesignModules } from './ant-design.modules';
import { Menu } from './models/menu.model';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

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
      icon: 'appstore',
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
          routeUrl: '/client-management/',
          icon: 'unordered-list',
          subMenus: [],
        },
        {
          id: 'deduplication',
          name: 'Deduplication',
          routeUrl: '/client-management/deduplication',
          icon: 'merge',
          subMenus: [],
        },
      ],
    },
    {
      name: 'SHR Management',
      id: 'referral-management',
      routeUrl: '/shr-management',
      icon: 'user',
      category: 'main',
      subMenus: [
        {
          name: 'Health Records',
          id: 'health-records',
          routeUrl: '/shr-management/health-records/',
          icon: 'unordered-list',
          subMenus: [],
        },
        {
          name: 'Referral',
          id: 'referral',
          routeUrl: '/shr-management/referral-list',
          icon: 'unordered-list',
          subMenus: [],
        }
      ],
    },
    {
      name: 'Appointment Management',
      id: 'appointment-management',
      routeUrl: '/appointment-management',
      icon: 'user',
      category: 'main',
      subMenus: [
        {
          name: 'Appointments',
          id: 'appointments',
          routeUrl: '/appointment-management/appointments-list/',
          icon: 'unordered-list',
          subMenus: [],
        }
      ],
    },
    {
      name: 'Worflows Management',
      id: 'workflows-management',
      routeUrl: '/workflows-management',
      icon: 'apartment',
      category: 'main',
      subMenus: [
        {
          name: 'Workflows',
          id: 'workflows',
          routeUrl: '/workflows-management/workflows',
          icon: 'calendar',
          subMenus: [],
        },
        {
          id: 'schedules',
          name: 'Schedules',
          routeUrl: '/workflows-management/schedules',
          icon: 'schedule',
          subMenus: [],
        },
      ],
    },
    {
      id: 'mapping-and-data-extraction',
      name: 'Mapping and Data Extraction',
      routeUrl: '/mapping-and-data-extraction',
      icon: 'database',
      category: 'main',
      subMenus: [
        {
          name: 'Datasets',
          id: 'datasets',
          routeUrl: '/mapping-and-data-extraction',
          icon: 'snippets',
          subMenus: [],
        },
        {
          name: 'Configuration',
          id: 'settings',
          routeUrl: '/mapping-and-data-extraction/configuration',
          icon: 'tool',
          subMenus: [],
        },
        {
          name: 'Instances',
          id: 'instances',
          routeUrl: '/mapping-and-data-extraction/instances',
          icon: 'interaction',
          subMenus: [],
        },
        {
          name: 'Terminology services',
          id: 'termminology-services',
          routeUrl: '/mapping-and-data-extraction/termminology-services',
          icon: 'edit',
          subMenus: [],
        },
        {
          name: 'Validation',
          id: 'validation',
          routeUrl: '/validations',
          icon: 'unordered-list',
          subMenus: [],
        }
      ],
    },
    // add user management
    {
      name: 'User Management',
      id: 'user-management',
      routeUrl: '/user-management',
      icon: 'user',
      category: 'main',
      subMenus: [
        {
          name: 'Users',
          id: 'users',
          routeUrl: '/user-management',
          icon: 'unordered-list',
          subMenus: [],
        }
      ]},
    {
      name: 'Settings',
      id: 'settings',
      routeUrl: '/settings',
      icon: 'setting',
      category: 'main',

      subMenus: [
        {
          name: 'General',
          id: 'general',
          routeUrl: '/settings',
          icon: 'tool',
          subMenus: [],
        },
        {
          name: 'instances',
          id: 'settings',
          routeUrl: '/settings/instances',
          icon: 'interaction',
          subMenus: [],
        }
      ],
    },
  ];

  @Output() selectedMenu: EventEmitter<Menu> = new EventEmitter<Menu>();

  constructor(private authService: AuthService) {
    this.activeMainMenuId = !this.activeMainMenuId
      ? 'dashboard'
      : this.activeMainMenuId;
  }

  ngOnInit(): void { }

  onRouteTo(event: Event, menu: Menu): void {
    event.stopPropagation();
    this.selectedMenu.emit(menu);
  }
}
