import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import(
        './../../../../apps/dashboard/src/app/modules/home/home.module'
      ).then((m) => m.DashboardModule),
  },
  {
    path: 'client-management',
    loadChildren: () =>
      import(
        './../../../../apps/client-management/src/app/client-management/client-management.module'
      ).then((m) => m.ClientManagementModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import(
        './../../../../apps/settings/src/app/settings/settings.module'
      ).then((m) => m.SettingsModule),
  },
];
