import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  {
    path: 'settings',
    loadChildren: () =>
      import(
        './../../../../apps/settings/src/app/settings/settings.module'
      ).then((m) => m.SettingsModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import(
        './../../../../apps/dashboard/src/app/modules/home/home.module'
      ).then((m) => m.DashboardModule),
  },
];
