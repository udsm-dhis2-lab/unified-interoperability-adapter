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
    path: 'mapping-and-data-extraction',
    loadChildren: () =>
      import(
        './../../../../apps/mapping-and-data-extraction/src/app/mapping-and-data-extraction/mapping-and-data-extraction.module'
      ).then((m) => m.MappingAndDataExtractionModule),
  },
  {
    path: 'workflows-management',
    loadChildren: () =>
      import(
        './../../../../apps/workflows-management/src/app/workflows-management/workflows-management.module'
      ).then((m) => m.WorkflowsManagementModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import(
        './../../../../apps/settings/src/app/settings/settings.module'
      ).then((m) => m.SettingsModule),
  },
];
