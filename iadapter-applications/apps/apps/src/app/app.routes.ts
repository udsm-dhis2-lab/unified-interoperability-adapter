import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@iapps/d2-dashboard').then((m) => m.D2DashboardModule),
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
    path: 'referral-management',
    loadChildren: () =>
      import(
        './../../../../apps/referral-management/src/app/referral-management/referral-management.module'
      ).then((m) => m.ReferralManagementModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import(
        './../../../../apps/settings/src/app/settings/settings.module'
      ).then((m) => m.SettingsModule),
  },
];
